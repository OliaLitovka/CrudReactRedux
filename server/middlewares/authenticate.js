var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ form: 'Failed to authenticate' });
      } else {
        res.locals.connection.query('SELECT id, name FROM users WHERE id = ' + decoded.id, function(error, results, fields){
          if (error) { res.status(500).json(error)}
          if(results.length != 0){
            req.currentUser = results[0];
            if (req.currentUser.name == 'admin') req.admin = true;
            next();
          }
          else{
            res.status(404).json({ form: 'No such user' });
          }
        });        
      }
    });
  } else {
    res.status(403).json({form: 'Login to access'});
  }
}