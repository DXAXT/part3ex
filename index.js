const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request,response, next) => {
    const numberPersons = persons.length
    response.send(`<div> phonebook has info for ${numberPersons} people </div> <div> ${Date()} </div>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    //const id = Number(request.params.id)
    // const person = persons.find(person => person.id === request.params.id)
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing or name already added'
        })
    }

    // const person = {
    //     name: body.name,
    //     number: body.number,
    //     id: Math.floor(Math.random() * 10000)
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    // persons = persons.concat(person)
    
    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})