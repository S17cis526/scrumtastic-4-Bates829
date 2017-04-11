

module.exports = {
  create: create,
  destroy: destroy,
  loginRequired: loginRequired
};

var json = require('../../lib/form-json');
var encryption = require('./../lib/encryption');

/** @function create
* Creates a new session
*/
function create(req, res){
  json(req, res, function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    db.get("SELECT * FROM user WHERE username=?", [username], function(err, user){
      if(err){
        res.statusCode = 500;
        res.end("Server error");
        return;
      }
      if(!user){
      // username not in database
        return;
      }
      var cryptedPassword = encryption.digest(password + user.salt);
      if(cryptedPassword != user.cryptedPassword){
        //invalid username/password combination
      }
      else{
        // Successful login
        // store user.id in the cookie
        var cookieData = JSON.stringify(){userId: user.id});
        var encryptedCookieData = encryption.encypher(cookieData);
        // Encrypt userid
        res.setHeader("Set-Cookie", ["session=" + encryptedCookieData]);
        res.statusCode = 200;
        res.end("Successful Login");
      }
    });
  });
}

function destroy(req, res){
  res.setHeader("Set-Cookie", "");
  res.statusCode = 200;
  res.end("Logged out successful");
}

function loginRequired(req, res, next){
  var session = req.headers.cookie.session;
  var sessionData = encryption.decypher(session);
  var sessionObj = JSON.parse(sessionData);
  if(sessionObj.userId){
    req.currentUserId = sessionObj.userId;
    return next(req, res);
  }
  else{
    res.statusCode = 403;
    res.end("Authentication required");
  }
}
