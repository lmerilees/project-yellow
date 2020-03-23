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
        req.session.user_id = result.rows[0].id;
        console.log("Password matches!");
        res.redirect("index");
      }
    })
  });



  // get current session username
app.get("/getUser", function(req, res){
  res.send(req.session.username);
});


app.get("/index", function(req,res){
    if(req.session.loggedin){
      res.sendFile(path.resolve(__dirname, '../html',"index.html"))
    }
    // need to get data from database and send to html js 
    // to display on page
  });

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

// CREATE TABLE projects(user_id int not null, project_id serial primary key not null, project_name VARCHAR(50) not null unique );
app.post("/project-add", function(req,res){
  console.log(req.body.proj_name)
  console.log(req.body.user_id)
  let sql = "INSERT INTO projects(user_id, project_name) VALUES ('"+req.body.user_id+"', '"+req.body.proj_name+"')"
  pool.query(sql,function(err,result){
    if(err){
      res.send("Insert Error")
    } else{
      res.send("added");
    }
  });
});



// get userID of current user
app.post("/getUserID", function(req, res){
  let sql = "SELECT user_id FROM users WHERE username = '" + req.session.username + "'";
  pool.query(sql, function(err, result){
    if (err){
      throw err;
    }else{
      res.jsonp(result)
    }
  });
});

app.post("/getProjectData", function(req,res){

});
app.post("/getStepsData", function(req,res){

});

app.post("/deleteProject", function(req,res){
  let sql = "SELECT project_id FROM projects WHERE project_name = '" + req.body.projectName + "'"
  pool.query(sql, function(err,result){
    console.log(result.rows[0].project_id);
    if(err){
      res.send("err in project name");
    }else{
      sql = "DELETE FROM steps where project_id = " + result.rows[0].project_id
      pool.query(sql, function(err){
        if(err){
          console.log("test");
          res.send("deleted");
          pool.query("DELETE FROM projects where project_id = " + result.rows[0].project_id,function(err){
            if(err){
              console.log("error in deleting project")
            }
          });
        }else{
          pool.query("DELETE FROM projects where project_id = " + result.rows[0].project_id, function(err){
            if(err){
              console.log("error in deleting project")
            }
          })
          res.send("deleted");
        }
      });
    }
  });
});

app.post("/allProjects", function(req,res){
  pool.query("SELECT * FROM projects WHERE user_id ='" + req.body.userID +"'", function(err, result){
    if(err){
      res.send("err");
    }else{
      res.send(result);
    }
  });
});
  // // insert new step into database
  // app.post("/addStep", function(req, res){
  
  //   let sql = "INSERT INTO steps (step_id, stepname, user_id) VALUES(DEFAULT, " + "'" + req.body.stepName + "'" + ", " + req.body.userID + ")";

  //   pool.query(sql, (err, results) => {
  //     console.log(sql);
  //     if (err){
  //       throw err
  //     }
  //     else{
  //       res.jsonp(results)
  //     }
  //   })
  // })

  // // select all steps with current userid (/project id?)
  // app.post('/populateSteps', function(req, res){
  //   const userID = req.body.userID;
  //   let sql = "SELECT * FROM steps where user_ID = " + "'" + userID + "'";
  //   pool.query(sql, (err, results) => {
  //     console.log(sql);
  //     if (err){
  //       throw err
  //     }
  //     else{
  //       res.jsonp(results.rows)
  //     }
  //   })
  // })
  
  // // count rows in current step table
  // app.post('/getRowCount', function(req, res){
  //   let userID = req.body.userID;
  //   let sql = "SELECT COUNT(*) AS rowcount FROM steps WHERE user_ID = " + "'" + userID + "'";
  //   console.log(sql);
  //   pool.query(sql, (err, results) => {
  //     if (err){
  //       throw err
  //     }
  //     else{
  //       res.jsonp(results.rows[0].rowcount)
  //     }
  //   })
  // })
  

https.createServer({
  key: fs.readFileSync( path.resolve( 'src/server/key.pem')),
  cert: fs.readFileSync(path.resolve('src/server/cert.pem'))
}, app).listen(8000)