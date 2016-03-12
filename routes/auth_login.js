var jwt = require('jsonwebtoken');
const server_key = "sjasadbhfdbadfkjmslkdaskasslksdnlksdala";
var payload;


var getPayLoad = function(myJson) {
    if(myJson) {
        try {
            console.log('in try');
            payload = jwt.verify(myJson.token, server_key);
            console.dir(payload);
            return payload;
        }
        catch (e) {
            if (e.name == 'TokenExpiredError') {
                console.log('token is expired');
                //NEED TO CHANGE...session expired...Chances rare***********************Generate a new active token
            } else {
               //invalid token
                console.log('token is invalid');
            }
            return null;
        }
    }
    return null;
}



exports.authLogin= function(req,res,next){
    //1st chk if already existing username
    var payload = getPayLoad(req.body);
    if(payload){
        console.log('Token is valid');
        next();
    }
    else {
        res.send({"status":"Invalid","reason":"username or password as null"});
    }
}


