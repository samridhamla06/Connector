var mongoClient = require('../database/mongoClient.js');
var mongoURL = "mongodb://localhost:27017/DCDS";
var jwt = require('jsonwebtoken');
const server_key = "sjasadbhfdbadfkjmslkdaskasslksdnlksdala";
var payLoad = new Object();
var token;

var signToken = function (email, time, suffering, userName) {
    payload = {"email": email, "admin": true, "suffering": suffering, "userName": userName};
    token = jwt.sign(payLoad, server_key, {expiresIn: time});
}

var validateCredentials = function (email, password, callback) {
    mongoClient.connect(mongoURL, function (err, db) {
        if (err) {
            console.log('couldnt connect to MongoDb');
            callback(err, null);//as the END USER SHOULD BE NOTIFIED ABOUT THIS
        } else {
            console.log('GOT CONNECTED TO MONGODB');
            var collection = db.collection('All_Users')
            collection.findOne({"email": email, "password": password}, {"password": 0}, callback);//can add function
        }
    })

}

function addStatusAndToken(record) {
    record.token = token;
    record.status = "Valid";
}

exports.login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email + ' trying to log in');

    var sendResponse = function (err, record) {
        if (!err && record) {//-------------------------------------------FOUND THE MATCHING RECORD

            var sufferingName = record.sufferingName;//-----------------------------RETRIEVING suffering TO ADD LATER ON IN TOKEN PAYLOAD
            var email = record.email;
            var userName = record.userName;
            var expiryTime = 60 * 60;
            var userId = record._id;
            var location = record.location
            console.log('Valid user which is ' + JSON.stringify(record));
            signToken(email, expiryTime, sufferingName, userName);
            addStatusAndToken(record);
            console.log('the user ' + userName + ' has logged in');
            res.send(record);
        } else {
            console.log('Invalid UserName');
            res.send({"status": "Invalid", "token": null, "reason": "Invalid Username/Password"});
        }
    }

    var isNotAGuest = function (email, password) {
        return email != 'GUEST' && password != 'GUEST';
    }

    if (email && password && isNotAGuest) {
        validateCredentials(email, password, sendResponse)
    } else if (!isNotAGuest) {
        signToken(email, expiryTime, 'OCD', 'GUEST');//by default for guest...NO NEED TO GO FOR MONGODB CONNECTION
    } else {
        res.send({"status": "Invalid", "token": null, "reason": "email or Password is Null"});
    }
}