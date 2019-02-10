
var express = require("express"),
  app = express(),
   request = require('request'),

  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  user = require("./models/users"),
  subdb = require("./models/subdb"),
  scoredb = require("./models/scoredb"),
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

//route for admin to create test
app.get("/createtest" , function(req ,res) {
  res.render("testsch");
})


//route to view questions
app.get("/ques/:code" , function(req, res) {
    var code  = req.params.code;
    subdb.find({testcode: code } , function(err , arr) {
      if(err)
      {
        console.log(err);
      }
      else
      {
        console.log(arr);
        res.render("ques" , { arr: arr });
      }
    });
    
})

//to get question using AJAx
app.get("/getques/:id" , function(req, res) {
    console.log(req.params)
    console.log(quess[req.params.id])
    res.send(quess[req.params.id]);
})

//Ajax response to check if user is already registered
app.get("/ajax/chuser/:id" , function(req, res) {
    console.log(req.params.id);
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
      else
      {
      res.json(uname);
      }
    })
    
})

app.get("/testsch" , function(req, res) {
    res.render("testsch");
})

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


//to post test chedule in db
app.get("/posttest/:id/:code" , function(req , res)
{
  
  // console.log(req.params.code);
  var code = req.params.code;
  var arrobj = JSON.parse(req.params.id);
  // console.log(arrobj[0].sub);
  for(var i = 0 ; i < arrobj.length ; i++)
  {
    // console.log(arrobj[i].sub ,  arrobj[i].staff);
    subdb.create({testcode: code  , sub: arrobj[i].sub , staff: arrobj[i].staff} , function(err , entry) {
        if(err) 
        {
          console.log(err);
        }
        else
        {
          console.log(entry);
        }
    } )
  }
  res.send("err");
}
);


//To post score to db with AJAX
app.get("/testscore" , function(req, res) {
    
    res.send("yess");
})



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

