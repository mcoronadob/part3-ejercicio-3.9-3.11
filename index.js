require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

const Agenda = require('./models/agenda')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    if (req.method === 'POST' && req.body) {
        return JSON.stringify(req.body);
    }
    return '';
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World from Agenda Ejercicio!</h1>')
})

app.get('/api/agenda', (request, response) => {
  Agenda.find({}).then((agenda) => {
    response.json(agenda)
  })
})

app.get('/info', (request, response) => {
  const fechaActual = new Date()

  const contenido = `
    <p>Phonebook has info for people</p>
    <p>${fechaActual}</p>
  `
  
  response.send(contenido)
})

app.get('/api/agenda/:id', (request, response, next) => {
  Agenda.findById(request.params.id)
    .then((agenda) => {
      if (agenda) {
        response.json(agenda)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})


app.post('/api/agenda', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' })
  }

  const agenda = new Agenda({
    name: body.name,
    number: body.number,
  })

  agenda.save().then((savedAgenda) => {
    response.json(savedAgenda)
  })
})

app.put('/api/agenda/:id', (request, response, next) => {
  const { name, number } = request.body

  Agenda.findById(request.params.id)
    .then((agenda) => {
      if (!agenda) {
        return response.status(404).end()
      }

      agenda.name = name
      agenda.number = number

      return agenda.save().then((updatedAgenda) => {
        response.json(updatedAgenda)
      })
    })
    .catch((error) => next(error))
})

app.delete('/api/agenda/:id', (request, response, next) => {
  Agenda.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
