var express = require('express');
var router = express.Router();
var validateSignup = require('../validations/validateSignup');
var validateEditUser = require('../validations/validateEditUser');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var isEmpty = require('lodash/isEmpty');
var authenticate = require('../middlewares/authenticate');
var mysql = require('../models/mysql');
var config = require('../config');
var uniqueness = require('../middlewares/uniqueness');

const tUsers = 'users'; //таблица пользователей

/* GET users listing. */
router.get('/', authenticate, function(req, res, next) {
  if (req.admin) {
    let sql = 'SELECT id, name, email FROM ' + tUsers;  
    mysql(res, sql, function(results) { 
      res.json(results);
    }); 
  } else {
    res.status(403).json({form: 'Access error'});
  }    
});

//регистрация пользователей
router.post('/', function(req, res, next) {
    const {errors, isValid} = validateSignup(req.body);
    if (isValid) {
      var user = {
        name: req.body.name,        
        email: req.body.email,
        password: req.body.password
      };
      //проверка уникальности name и email
      uniqueness(req, res, function() {
        user.password = bcrypt.hashSync(user.password, 10);
        
        let sql = {
          sql: 'INSERT INTO '+ tUsers +' SET ?',
          values: [user]
        }  
        mysql(res, sql, function(results) { 
           res.json(results);
        });        
      });                    
    } else {      
      res.status(400).json(errors);
    }
});


router.get('/edit/:id', authenticate, function(req, res, next) {
  if (req.params.id == req.currentUser.id || req.admin) {
    //получает name, email и передает форме редактирования
    let sql = 'SELECT name, email FROM ' + tUsers + ' WHERE id = ' + req.params.id;  
    mysql(res, sql, function(results){ 
      if(results.length != 0) res.json(results);
      else (res.json({form: 'User not found'}))
    }); 
  } else {
    res.status(403).json({form: 'Access error'});
  }   
  
});

router.put('/edit', authenticate,  function(req, res, next) { 
    //проверят заполнение полей, возврашает ошибки, валидность (true/false), пользователя (значения заполненых полей)   
    const {errors, isValid, user} = validateEditUser(req.body); 
    if (!isValid){
      res.status(400).json(errors);
    }
    else{
      //если пользователь не пуст
      if(!isEmpty(user)){ 

        const {password, userId} = req.body; 
        //если не передается долнительный параметр с id пользователя
        if (!userId) {                
        
          let sql = 'SELECT password FROM '+ tUsers +' WHERE id = ' + req.currentUser.id;    
          mysql(res, sql, function(results){ 
            if (results.length != 0) {
              //проверка пароля       
              if (bcrypt.compareSync(password, results[0].password)) {
                //проверка уникальности имен
                uniqueness(req, res, function(){
                  //обновление пользователя                
                  let sql = {
                    sql: 'UPDATE ' + tUsers + ' SET ? WHERE id = ' + req.currentUser.id,
                    values: [user]
                  }
                  mysql(res, sql, function(results) { 
                    //новый токен при изменении имени
                    if(user.name){
                        const token = jwt.sign({
                          id: req.currentUser.id,
                          name: user.name
                        }, config.jwtSecret);
                        res.json({token});  
                      } else {
                        res.json(results);
                      }
                  }); 
                });
                                                         
              } else{
                res.status(401).json({form: 'Invalid password'});             
              }
            } else {
              res.status(404).json({form: 'No such user'}); 
            }
          });
        } else if (req.admin) { //если передается дополнительный id проверяем на админа
            let sql = 'SELECT id FROM ' + tUsers + ' WHERE id = ' + userId;  
            mysql(res, sql, function(results){ 
              if(results.length != 0) {
                let sql = 'SELECT password FROM '+ tUsers +' WHERE name = "admin"';    
                mysql(res, sql, function(results){
                  if (bcrypt.compareSync(password, results[0].password)) {
                    uniqueness(req, res, function(){
                      //обновление пользователя                
                      let sql = {
                        sql: 'UPDATE ' + tUsers + ' SET ? WHERE id = ' + userId,
                        values: [user]
                      }
                      mysql(res, sql, function(results) {                         
                        res.json(results);                          
                      }); 
                    });

                  } else{
                    res.status(401).json({form: 'Invalid password'});             
                  }
                });

              } else {
                (res.json({form: 'User not found'}))
              }
            });
          
        } else {
          res.status(403).json({form: 'Access error'});
        }    
                
      }
    else{
      res.json({form: 'Enter the data'});
    }
  }
});

router.delete('/delete/:id', authenticate, function(req, res, next) {
  if (req.admin && req.params.id != 1) {
    let sql = 'DELETE FROM ' + tUsers + ' WHERE id = '+req.params.id;  
    mysql(res, sql, function(results) { 
      res.json(results);
    }); 
  } else {
    res.status(403).json({form: 'Access error'});
  }    
});

module.exports = router;