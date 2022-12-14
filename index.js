const express = require('express')
const app = express()
const cors = require('cors')
const morgan=require('morgan')
require('dotenv').config()

const Note = require('./models/persons')



app.use(express.json())

app.use(cors())


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
  Note.find({}).then(persons => {
    res.json(persons)
  })
})

app.put('/api/persons/:id',(request,response,next) => {
  console.log(`id:${request.params.id}`)
  console.log(request.body)
  Note.findOneAndUpdate({ id:request.params.id },request.body).then(response.status(204).end())
    .catch(error => next(error))

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
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.get('/info',(req,res) => {
  Note.find({}).then(persons => {
    res.send(`<div>PhoneBook has info for ${persons.length}</div><div>${new Date()}</div>`)
  })
})

app.post('/api/persons', (request, response,next) => {
  console.log('got request')
  const body = request.body

  const note =new Note({
    name: body.name,
    number: body.number,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden k??sittely
app.use(unknownEndpoint)


// t??m?? tulee kaikkien muiden middlewarejen rekister??innin j??lkeen!
app.use(errorHandler)


const PORT = process.env.PORT
const HOST = '0.0.0.0'
app.listen(PORT,HOST, () => {
  console.log(`Express web server started: http://${HOST}:${PORT}`)
})