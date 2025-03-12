const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request,response) => {
    const numberPersons = persons.length
    response.send(`<div> phonebook has info for ${numberPersons} people </div> <div> ${Date()} </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    //const id = Number(request.params.id)
    const person = persons.find(person => person.id === request.params.id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== request.params.id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number || persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'content missing or name already added'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000)
    }

    persons = persons.concat(person)
    
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})