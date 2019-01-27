
var express = require("express"),
  app = express(),
   request = require('request'),

  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  user = require("./models/users"),
  passportLocalMongoose = require("passport-local-mongoose");
  

mongoose.connect(
process.env.DATABASEURL  || "mongodb://localhost:27017/feedback"  ,
  { useNewUrlParser: true }
);


  
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
passport.use(new LocalStrategy(user.authenticate()));


var quess = [ "Q1.Explains the concept clearly" , "Q2.Relates Theoretical Course Concepts with Real Time Applications" , 
"Q3.Has been able to increase my knowledge on subject" , "Q4.Helping students in providing study materials Lecture Notes,question banks with answer etc" , 
"Q5.Conducting regular slip tests" , "Q6.Providing guidance for exam preparation" , 
"Q7.Specifies the  importance of topics in GATE and other competitive exams,current affair etc" , 
"Q8.Relates well with students and encourage interaction for clearing doubts"  , 
"Q9.Provides assistance and counseling to the needy students"  , 
"Q11.Communicates in English" , "Q12.Speaks clearly and audibly" , "Q13.Maintains discipline inside the class" , 
"Q14.Makes the classroom very lively and interacting" , "Q15.General Feedback (Additional Comments)"];


//isLoggedin
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//just a check route
app.get("/check" , function(req, res) {
    res.render("testsch.ejs");
})

//to get question using AJAx
app.get("/getques/:id" , function(req, res) {
    console.log(req.params)
    console.log(quess[req.params.id])
    res.send(quess[req.params.id]);
})

//display Questions 
app.get("/ques/:num" , function(req, res) {
    res.render("ques.ejs" , {num : (parseInt(req.params.num) - 1) , ques : quess});
})


//Ajax response to check if user is already registered
app.get("/ajax/chuser/:id" , function(req, res) {
    console.log(req.params.id);
    // res.send("hii");
    // res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify({ a: 1 }));
    user.findOne({username: req.params.id} , function(err , uname)  
    {
      if(err)
      {
        console.log(err);
      }
      if(uname == undefined)
      {
        res.send("err");
      }
      // res.send("user exists");
      res.json(uname);
    })
    
})


//logic to catch the next question
app.post("/ques/:num"  , function(req , res) {
  //logic to post the value in the database along wiht the student name
  console.log(req.body);
  res.redirect("/ques/" + String(parseInt(req.params.num) + 1) );
}  );

// The root that redirects to index
app.get("/", function(req, res) {
  res.redirect("/index");
});

// Index page to display form
app.get("/index" , function(req , res)  {
    res.render("index.ejs");
} );


//Login the user
app.get("/userpage" , function(req , res) { 
    res.render("login");
}  ) 







// Post request to login user
app.post("/index" , function(req , res)   {
    console.log(req.body);
    user.register(
    new user({ username: req.body.username , regno: req.body.username , dept: req.body.dept ,
        name: req.body.name
    }),
    req.body.username ,
    function(err, user) {
      if (err) {
        console.log(err);
        if (err.name == "UserExistsError") {
            console.log(req.body);
            console.log(req.body.password);
                  passport.authenticate("local")(req, res, function() {
            res.redirect("/userpage");
          });

        
        }
      } else {
          console.log('new user');
                  passport.authenticate("local")(req, res, function() {
            res.redirect("/userpage");
          });

        
      }
    }
  );    

});
    


// Logging in the user
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/userpage",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);


// Log out the user
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("The Feedback-monitor app Has Started!");
});

