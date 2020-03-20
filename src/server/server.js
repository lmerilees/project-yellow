const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
const path = require('path');
const pool = require('./database')
const https = require('https')
const fs = require('fs')
const bcrypt = require('bcryptjs');
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

app.post("/register", function(req, res){
  // console.log(req.body)
  bcrypt.genSalt(10,function(err, salt){
    if(err){
      throw err;
    }else {
      bcrypt.hash(req.body.password, salt, function(err, hash){
        if(err){
          throw err;
        }else{
          pool.query("SELECT username FROM users WHERE username = '" + req.body.username + "'", (err,ret) => {
            if (err) {
              console.log(err.stack);
            }else{
              if(ret.rows.length == 0){
                pool.query("INSERT INTO users(username, password) VALUES('" + req.body.username+"'"+",'" + hash +"')");
                res.send("success");
              }else{   
                res.send("Username has been taken!");
              }
            }
          });
        }
      });
    }
  });
});

app.post("/login",function(req, res){
  pool.query("Select * from users WHERE username ='" + req.body.username+"'", function(err,result){
    let hash = result.rows[0].password;
    bcrypt.compare(req.body.password, hash, function(err, isMatch) {
      if (err) {
        throw err
      } else if (!isMatch) {
        console.log("Password doesn't match!")
        res.send("Username or Password is incorrect!");
      } else {
        req.session.loggedin = true;
        req.session.username = result.rows[0].username;
        console.log("Password matches!");
        res.redirect("index");
      }
    })
  });

  app.get("/getuser", function(req, res){
    res.send(req.session.username);
  })

  app.post("/getuser", function(req, res){
    pool.query("SELECT * from users", function(err, results){
      if (err){
        throw err
      }
      else{
        res.jsonp(results)
      }
    })
  })


});
  
  

app.get("/index", function(req,res){
  if(req.session.loggedin){
    res.sendFile(path.resolve(__dirname, '../html',"index.html"))
  }
  // need to get data from database and send to html js 
  // to display on page
});

https.createServer({
  key: fs.readFileSync( path.resolve( 'src/server/key.pem')),
  cert: fs.readFileSync(path.resolve('src/server/cert.pem'))
}, app)
.listen(8000)