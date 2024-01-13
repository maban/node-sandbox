const express = require('express')
const app = express()

// Routes

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(3000, ()=> {
    console.log(`App is running on port 3000`)
})