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
    if(result.rows.length !=0){
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
      });
    } else{
      res.send("Username or Password is incorrect!");
    }
  });
});

  // get current session username
app.post("/getUser", function(req, res){
  res.send(req.session.username);
});


app.get("/index", function(req,res){
    if(req.session.loggedin){
      res.sendFile(path.resolve(__dirname, '../html',"index.html"))
    }
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

// get project ID of current project

// populate steps for current project
app.post("/getProjectData", function(req,res){
  //NEED To FIX THIS
  pool.query("SELECT * FROM steps WHERE project_name ='" + req.body.projectName +"'", function(err, result){
    if(err){
      res.send("err");
    }else{
      console.log(result.rows)
      res.send(result.rows);
    }
  });
});




// delete project
app.post("/deleteProject", function(req,res){
  let sql = "DELETE FROM projects WHERE project_name = '" + req.body.projectName + "'"

  pool.query(sql, function(err,result){
    console.log("test");
    if(err){
      res.send(err)
    }else{
      res.send("deleted")
    }
  });
});

// list all projects
app.post("/allProjects", function(req,res){
  console.log(req.body.userID)
  pool.query("SELECT * FROM projects WHERE user_id ='" + req.body.userID +"'", function(err, result){
    if(err){
      res.send("err");
    }else{
      res.send(result);
    }
  });
});


// ADD card data to database
  app.post("/step-add", function(req, res){
    let sql = "INSERT INTO steps (step_id, stepname, stepinfo, project_name) VALUES(DEFAULT, " + "'" + req.body.cardName + "'" + ", " + "'" + req.body.cardInfo + "'" + ", " + "'" + req.body.projectName + "'" + ")";
    pool.query(sql, (err, results) => {
      // console.log(sql);
      if (err){
        res.send(err)
      }
      else{

        res.send(results)
      }
    })
  })

  
// delete card from database
app.post("/step-delete", function(req, res){
  let sql = "DELETE FROM steps WHERE stepname = '" + req.body.stepName + "'"
  pool.query(sql, (err, results) => {
    console.log(sql);
    if (err){
      res.send(err)
    }
    else{
      res.send("true")
    }
  })
})


// Insert task data to cards table
app.post("/task-add", function(req, res){
  let value;
  if(req.body.check){
    value = "TRUE"
  }else{
    value = "FALSE"
  }
  let sql = "INSERT INTO tasks (task_id, taskname, stepname, checkvalue) VALUES(DEFAULT, "
   + "'" + req.body.taskName + "'" + ", " + "'" + req.body.stepName + "'" + ','+ value +' )';
   console.log(req.body.taskName, req.body.stepName)
  
  pool.query(sql, (err, results) => {
    console.log(sql);
    if (err){
      res.send(err)
    }
    else{
      res.send("Task added!")
    }
  })
});

app.post("/alter-check", function(req,res){

  let sql = "UPDATE tasks SET checkvalue = " +req.body.data+" WHERE stepname = '"
  +req.body.step+"' AND taskname = '"+req.body.task+"'"
  console.log(sql);
  pool.query(sql, (err,result) => {
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
});

//remove task data from cards table
app.post("/task-delete", function(req, res){
  let sql = "DELETE FROM tasks WHERE taskname = '" + req.body.taskName + "'"
  pool.query(sql, (err, results) => {
    console.log(sql);
    if (err){
      throw err
    }
    else{
      res.send("true")
    }
  })
})



// modify task data
app.post("/task-modify", function(req, res){
 let sql = "ALTER FROM steps WHERE taskname = ' " + req.body.taskName + "'"
 pool.query(sql, (err, results) => {
   if (err){
     throw err
    }
   else{
      res.send("true")
    }
  })  
})
  

https.createServer({
  key: fs.readFileSync( path.resolve( 'src/server/key.pem')),
  cert: fs.readFileSync(path.resolve('src/server/cert.pem'))
}, app).listen(8000)