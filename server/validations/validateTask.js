var Validator = require('validator');
var isEmpty = require('lodash/isEmpty');

module.exports = function validateTask(data) {
  let errors = {};
  
  if (Validator.isEmpty(data.subject)) {
    errors.subject = 'This field is required';
  }  
  if (Validator.isEmpty(data.description)) {
    errors.description = 'This field is required';
  }  
  if (Validator.isEmpty(data.date)) {
    errors.date = 'This field is required';    
  } 
  if (!Validator.toDate(data.date)) {
    errors.date = 'Error date format'; 
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  }
}