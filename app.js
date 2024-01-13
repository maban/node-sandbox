const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()


// Connections

require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('✔ Connected to database')
    app.listen(3000, ()=> {
        console.log(`✔ Running on port 3000`)
    })    
}).catch(() => {
    console.log(error)
})


// Routes

app.get('/', (req, res) => {
    res.send('Home')
})

app.get('/account', (req, res) => {
    res.send('Account')
})
