const dotenv = require('dotenv')
const handlebars = require('express-handlebars');
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const app = express()

// Middleware

app.use(cors());
app.use(express.json());


// Views

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static('public'))

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/'
}));


// Connections

require('dotenv').config()

mongoose.connect('mongodb+srv://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + process.env.MONGODB_URI).then(() => {
    console.log('👍 Connected to database')
    app.listen(process.env.PORT, ()=> {
        console.log(`👍 Running on port ` + process.env.PORT)
    })    
}).catch(() => {
    console.log('💩 Database connection failed')
})


// Routes

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/account', (req, res) => {
    res.render('account');
})
