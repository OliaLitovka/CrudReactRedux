var isEmpty = require('lodash/isEmpty');
var mysql = require('../models/mysql');

module.exports = (req, res, callback) => {
  var user = {
    name: req.body.name,        
    email: req.body.email
  };

  let validErrors = {};

  let sql = 'SELECT email FROM users WHERE email = \"' + user.email + '\" LIMIT 1';
  if (req.currentUser){
    sql = 'SELECT email FROM users WHERE email = \"' + user.email + '\" AND id != \"' + req.currentUser.id + '\" LIMIT 1';
  }
  if (req.body.userId){
    sql = 'SELECT email FROM users WHERE email = \"' + user.email + '\" AND id != \"' + req.body.userId + '\" LIMIT 1';
  }
  //проверка уникальности email
  mysql(res, sql, function(results){ 
    if(results.length != 0){
      validErrors.userEmail = 'There is user with such email';          
    }

    let sql = 'SELECT name FROM users WHERE name = \"' + user.name + '\" LIMIT 1';
    if (req.currentUser){
      sql = 'SELECT name FROM users WHERE name = \"' + user.name + '\" AND id != \"' + req.currentUser.id + '\" LIMIT 1';
    }
    if (req.body.userId){
      sql = 'SELECT email FROM users WHERE name = \"' + user.name + '\" AND id != \"' + req.body.userId + '\" LIMIT 1';
    }
    //проверка уникальности name
    mysql(res, sql, function(results){ 
      if(results.length != 0){
        validErrors.userName = 'There is user with such name';          
      }  
      if (!isEmpty(validErrors)){  
        res.status(400).json(validErrors);
      }
      else {
        callback();
      }    
    });
  });
}