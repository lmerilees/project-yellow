
const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session')
const path = require('path');
const pool = require('./database')
const https = require('https')
const fs = require('fs')
const app = express();

app.use(bodyparser.urlencoded({extended: false }))
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.get("/login", function(req,res){
    res.sendFile(path.resolve(__dirname, '../html',"login.html"))
});

app.get("/register", function(req,res){
  res.sendFile(path.resolve(__dirname, '../html',"register.html"))
});

app.get("/index", function(req,res){
  res.sendFile(path.resolve(__dirname, '../html',"index.html"))
});

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
});

https.createServer({
  key: fs.readFileSync( path.resolve( 'src/server/key.pem')),
  cert: fs.readFileSync(path.resolve('src/server/cert.pem'))
}, app)
.listen(8000)