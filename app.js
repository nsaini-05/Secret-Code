//jshint esversion:60
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');



app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


mongoose.connect('mongodb://localhost:27017/usersDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const usersSchema = new mongoose.Schema({
  email: String,
  password: String
});
usersSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  excludeFromEncryption: ['email']
});



const User = new mongoose.model('User', usersSchema);


app.get("/", function(req, res) {
  res.render('home');
})


app.get("/register", function(req, res) {
  res.render('register');
})

app.post('/register', function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    (err) ? res.send(err): res.render("secrets");
  });
})



app.get("/login", function(req, res) {
  res.render('login');
})

app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {

    if (err) {
      console.log(err);

    } else {
      console.log(foundUser);
      if (foundUser) {
        (foundUser.password === password) ? res.render('secrets'): res.redirect("/");
      }
    }
  });

});



app.listen('3000', function(res) {
  console.log("Server started on port 3000");
});
