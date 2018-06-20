var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var validateLogin = require('../validations/validateLogin');
var isEmpty = require('lodash/isEmpty');
var config = require('../config');
var mysql = require('../models/mysql');

var router = express.Router();

const tUsers = 'users';

router.post('/', function(req, res, next) {
  console.log(req.query);
    const {errors, isValid} = validateLogin(req.body);
    const {identifier, password} = req.body;
    if (isValid){
      
      let sql = 'SELECT id, name, password FROM '+ tUsers +' WHERE name = \"' + identifier + '\" OR email = \"' + identifier + '\" LIMIT 1';  
      mysql(res, sql, function(results){       
        
        if(results.length != 0){        
          if(bcrypt.compareSync(password, results[0].password)){
            const token = jwt.sign({
              id: results[0].id,
              name: results[0].name
            }, config.jwtSecret);
            res.json({token});              
          }
          else{
            res.status(401).json({form: 'Invalid credentials'});             
          }
        } 
        else res.status(401).json({form: 'Invalid credentials'});          
        
      });
    }
    else{
      res.status(400).json(errors);
    }
});

module.exports = router;