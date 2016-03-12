var express = require('express');
var bodyParser = require('body-parser');
var registerObject = require(__dirname + '/routes/register.js');
var groupsObject = require(__dirname + '/routes/groups.js');
var loginObject = require(__dirname + '/routes/login.js');
var authLoginObject = require(__dirname + '/routes/auth_login.js');

var app = express();
app.use(bodyParser.json());

function tokenValidate() {
  return true;
}

app.get('/authLogin',authLoginObject.authLogin,groupsObject.read);
app.post('/authLogin',authLoginObject.authLogin,groupsObject.read);
app.post('/register',registerObject.register);//middleware should check if username already exists.
app.post('/login',loginObject.login);

module.exports = app;