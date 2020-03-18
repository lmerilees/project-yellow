const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session')
const path = require('path');
// const pool = require('./queries')
const app = express();

app.use(bodyparser.urlencoded({extended: false }))
app.use(bodyparser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// for local javascript files 
// app.use('/JavaScript/register.js', express.static('./JavaScript/register.js'))

app.get("/", function(req,res){
    res.sendFile(path.resolve(__dirname, '../html',"index.html"))
});

app.listen(8000);