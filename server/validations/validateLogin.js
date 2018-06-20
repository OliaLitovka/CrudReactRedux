var Validator = require('validator');
var isEmpty = require('lodash/isEmpty');

module.exports = function validateLogin(data) {
  let errors = {};
  
  if (Validator.isEmpty(data.identifier)) {
    errors.identifier = 'This field is required';
  }  
  if (Validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }  
  
  return {
    errors,
    isValid: isEmpty(errors)
  }
}