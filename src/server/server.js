const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session')
const path = require('path');
const pool = require('./database')
const app = express();

app.use(bodyparser.urlencoded({extended: false }))
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static(path.join(__dirname, '../js')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
console.log(path.join(path.join(__dirname, '../public')));
// for local javascript files 
// app.use('/JavaScript/register.js', express.static('./JavaScript/register.js'))

app.get("/", function(req,res){
    res.sendFile(path.resolve(__dirname, '../html',"login.html"))
});

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
});

app.listen(8000);