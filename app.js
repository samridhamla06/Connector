var express = require('express');
var bodyParser = require('body-parser');
var registerObject = require(__dirname + '/routes/register.js');
var groupsObject = require(__dirname + '/routes/groups.js');
var loginObject = require(__dirname + '/routes/login.js');
var authLoginObject = require(__dirname + '/routes/auth_login.js');
var usersObject = require(__dirname + '/routes/users.js');
var userDescriptionObject = require(__dirname + '/routes/user_description.js');
var checkAuthorizationObject = require(__dirname + '/routes/checkAuthorization.js');
var addGroupObject = require(__dirname + '/routes/addGroup.js');
var joinGroupObject = require(__dirname + '/routes/joinGroup.js');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/',function(req,res){
    res.send({"status":"hello"});

});

app.get('/auth*',checkAuthorizationObject.validateCredentials);
app.get('/auth/groups/:gid',usersObject.retrieveUsers);
app.get('/auth/users/:userId',userDescriptionObject.getUserInfo);
app.get('/auth/readGroups/:sufferingName/:userId',groupsObject.readGroups);
app.get('/auth/readMyGroups/:userId',groupsObject.readMyGroups);
app.get('/readGroups/:sufferingName/:userId',groupsObject.readGroups);//UNAUTH - guest


app.post('/register',registerObject.register);//middleware should check if email already exists.
app.post('/login',loginObject.login);
app.post('/addGroup',addGroupObject.addNewGroup);//ADD AUTHENTICATION
app.post('/joinGroup/:gid',joinGroupObject.joinGroup);
module.exports = app;