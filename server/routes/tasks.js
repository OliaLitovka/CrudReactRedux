var express = require('express');
var validateTask = require('../validations/validateTask');
var bcrypt = require('bcrypt');
var isEmpty = require('lodash/isEmpty');
var router = express.Router();
var authenticate = require('../middlewares/authenticate');
var mysql = require('../models/mysql');

const tTasks = 'tasks';

//вывод задач
router.get('/', authenticate, function(req, res, next) {
  if (req.admin) {
    res.locals.connection.config.dateStrings = 'DATE';
    let sql = 'SELECT * FROM ' + tTasks;  
    mysql(res, sql, function(results){ 
      res.json(results);
    }); 
  } else {
    res.status(403).json({form: 'Access error'});
  }
});

router.get('/user', authenticate, function(req, res, next) {
  res.locals.connection.config.dateStrings = 'DATE'; //формат получения даты из MySql, для того чтобы установить для всего приложения нужно установить в MyConnection в файле app.js
    let sql = 'SELECT tasks.* FROM tasks, users, users_tasks WHERE users_tasks.id_user = users.id AND users_tasks.id_task = tasks.id AND users_tasks.id_user = ' + req.query.id;  
    mysql(res, sql, function(results){ 
      res.json(results);
    });     
});
//все пользователи с задачами
router.get('/users', authenticate, function(req, res, next) {
  if (req.admin) {
    res.locals.connection.config.dateStrings = 'DATE'; //формат получения даты из MySql, для того чтобы установить для всего приложения нужно установить в MyConnection в файле app.js
      let sql = 'SELECT users.name, tasks.* FROM tasks, users, users_tasks WHERE users_tasks.id_user = users.id AND users_tasks.id_task = tasks.id';  
      mysql(res, sql, function(results){ 
        res.json(results);
      });     
  } else {
    res.status(403).json({form: 'Access error'});
  }
});

//добавление задач в таблицу tasks и users_tasks
router.post('/add', authenticate, function(req, res, next) {
    var userId = req.body.userId;
    if (userId == req.currentUser.id) {
      var task = {
        subject: req.body.subject,
        description: req.body.description,
        date: req.body.date
      };
      const {errors, isValid} = validateTask(req.body);
      if (!isValid) {
        res.status(400).json(errors);
      } else {
        let sql = {
          sql: 'INSERT INTO '+ tTasks + ' SET ?',
          values: [task]
        } 
        mysql(res, sql, function(results){ 
          if (results.insertId) {
            var user_tasks={
              id_user: userId,
              id_task: results.insertId
            }
            let sql = {
              sql: 'INSERT INTO users_tasks SET ?',
              values: [user_tasks]
            } 
            mysql(res, sql, function(results){             
              res.json(results);
            });
          } else {
            res.status(500).json(error);
          }  
        });         
      }   
    } else {
      res.status(401).json({form: 'Authentication problems'});
    }
});

//заполнение формы редактирования задачи
router.get('/edit/:id', authenticate, function(req, res, next) {
  let sql = 'SELECT id_task FROM users_tasks WHERE id_task = ' + req.params.id + ' AND id_user = ' + req.currentUser.id;  
  mysql(res, sql, function(results){

    if (results.length != 0 || req.admin) {
      res.locals.connection.config.dateStrings = 'DATE';          
      
      let sql = 'SELECT * FROM ' + tTasks + ' WHERE id = ' + req.params.id;  
      mysql(res, sql, function(results) {             
        if(results.length != 0) res.json(results);
        else (res.json({form: 'Task not found'}))
      });          
    } else {
      res.status(403).json({form: 'You do not have access to this task'});
    } 
      
  });    
});

router.put('/edit', authenticate,  function(req, res, next) {     
    const {errors, isValid} = validateTask(req.body);
    if (!isValid){
      res.status(400).json(errors);
    } else{
      let sql = 'SELECT id_task FROM users_tasks WHERE id_task = ' + req.body.taskId + ' AND id_user = ' + req.currentUser.id;  
      mysql(res, sql, function(results) {
        if (results.length != 0 || req.admin) {
          let sql = 'SELECT * FROM ' + tTasks + ' WHERE id = ' + req.body.taskId;  
          mysql(res, sql, function(results) {
            if (results.length != 0) {
              var task = {
                subject: req.body.subject,
                description: req.body.description,
                date: req.body.date
              };
              let sql = {
                sql: 'UPDATE ' + tTasks + ' SET ? WHERE id = ' + req.body.taskId,
                values: [task]
              }  
              mysql(res, sql, function(results){ 
                res.json(results);
              }); 
            } else {
              res.json({form: 'Task not found'})
            }
          }); 
         

        } else {
          res.status(403).json({form: 'You do not have access to this task'});
        } 
      });
    }
});

router.delete('/delete/:id', authenticate, function(req, res, next) {    
    let sql = 'DELETE FROM ' + tTasks + ' WHERE id = '+req.params.id;  
    mysql(res, sql, function(results){ 
      res.json(results);
    }); 
});

module.exports = router;