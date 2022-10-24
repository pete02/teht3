const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan=require('morgan')
require('dotenv').config()

const Note = require('./models/persons')



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
app.use(express.json())

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


app.use(morgan(':method :url :status - :response-time ms :body'))





const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}




app.get('/api/persons', (req, res) => {
  Note.find({}).then(persons=>{
    res.json(persons)
  })
  })

app.put('/api/persons/:id',(request,response,next)=>{
  console.log(`id:${request.params.id}`)
  console.log(request.body)
  Note.findOneAndUpdate({id:request.params.id},request.body).then(response.status(204).end())
  .catch(error=>next(error))
  
})
app.use(express.static('build'))


app.get('/api/persons/:id', (request, response,next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

}) 

app.delete('/api/persons/:id', (request, response,next) => {
  Note.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


app.get('/info',(req,res)=>{
  Note.find({}).then(persons=>{
    res.send(`<div>PhoneBook has info for ${persons.length}</div><div>${new Date()}</div>`)
  })
})

app.post('/api/persons', (request, response,next) => {
  console.log("got request")
  const body = request.body

  const note =new Note({
      name: body.name,
      number: body.number,
    })

    note.save().then(savedNote => {
      response.json(savedNote)
    }).catch(error=>next(error))
})
  


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)


// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)


const PORT = process.env.PORT
const HOST = '0.0.0.0'
app.listen(PORT,HOST, () => {
  console.log(`Express web server started: http://${HOST}:${PORT}`);
})