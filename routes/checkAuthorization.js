var jwt = require('jsonwebtoken');
const server_key = "sjasadbhfdbadfkjmslkdaskasslksdnlksdala";
var payload;


var getPayLoad = function(token,next) {//myJson is the token basically
       try {
            payload = jwt.verify(token, server_key); // throws exception if not matched
            return payload;
        }
        catch (e) {
            if (e.name == 'TokenExpiredError') {
                console.log('token is expired');
                return {"status":"Valid"};
            } else {
               //invalid token
                console.log('token is invalid');
            }
            return null;
        }
    }



exports.validateCredentials= function(req,res,next){
    //1st chk if already existing username
    console.log('Token received is ' + req.headers.authorization);
   if(req.headers.authorization){
    var payload = getPayLoad(req.headers.authorization,next);
    if(payload){
        console.log('Token is valid');
        next();
    }
    else {
        res.send({"status":"Invalid","reason":"Wrong Username or Password"});
    }
}else{
     res.send({"status":"Invalid","reason":"No Auth Token Received "});
}
}


