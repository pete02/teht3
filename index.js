const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan=require('morgan')
let persons=[
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]


app.use(cors())
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
morgan.token('body', req => {
return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :body'))
app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }) 

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
app.get('/info',(req,res)=>{
    res.send(`<div>PhoneBook has info for ${persons.length}</div><div>${new Date()}</div>`)
})

app.post('/api/persons', (request, response) => {
  console.log("got request")
const body = request.body

if (!body.name|| !body.number ) {
    return response.status(400).json({ 
    error: 'content missing' 
    })
}

if(persons.filter(person=>person.name===body.name).length>0){
    return response.status(400).json({ 
        error: 'name must be unique' 
        })
}

const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})


app.use(express.static('build'))
const PORT = 3001
const HOST = '0.0.0.0'
app.listen(PORT,HOST, () => {
  console.log(`Express web server started: http://${HOST}:${PORT}`);
})