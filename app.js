var express = require('express');
var bodyParser = require('body-parser');
var registerObject = require(__dirname + '/routes/register.js');
var groupsObject = require(__dirname + '/routes/groups.js');
var loginObject = require(__dirname + '/routes/login.js');
var authLoginObject = require(__dirname + '/routes/auth_login.js');
var usersObject = require(__dirname + '/routes/users.js');
var userDescriptionObject = require(__dirname + '/routes/user_description.js');
var checkAuthorizationObject = require(__dirname + '/routes/checkAuthorization.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/*',checkAuthorizationObject.validateCredentials);
app.get('/groups/:gid',usersObject.retrieveUsers);//put authorization
app.get('/users/:userId',userDescriptionObject.getUserInfo);//put authorization
app.get('/readGroups/:sufferingName',groupsObject.read);

app.post('/register',registerObject.register);//middleware should check if username already exists.
app.post('/login',loginObject.login);





module.exports = app;