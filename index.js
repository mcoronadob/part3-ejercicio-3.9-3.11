const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())

let agenda = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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
  response.json(agenda)
})

app.get('/info', (request, response) => {
  const fechaActual = new Date()

  const contenido = `
    <p>Phonebook has info for people</p>
    <p>${fechaActual}</p>
  `
  
  response.send(contenido)
})

app.get('/api/agenda/:id', (request, response) => {
  const id = Number(request.params.id)
  const contacto = agenda.find((contacto) => contacto.id === id)

  if (contacto) {
    response.json(contacto)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId =
    agenda.length > 0 ? Math.max(...agenda.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}

app.post('/api/agenda', (request, response) => {
  const body = request.body
  const name_contacto = agenda.find(p => p.name === body.name);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  if (name_contacto) {
    return response.status(400).json(
      { error: 'name must be unique' 
        
      })
  }

  const contacto = {
    id: Number(generateId()),
    name: body.name,
    number: body.number
  }

  agenda = agenda.concat(contacto)

  response.json(contacto)
})

app.delete('/api/agenda/:id', (request, response) => {
  const id = Number(request.params.id)
  agenda = agenda.filter((contacto) => contacto.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
