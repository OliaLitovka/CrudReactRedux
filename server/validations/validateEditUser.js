var Validator = require('validator');
var isEmpty = require('lodash/isEmpty');
var bcrypt = require('bcrypt');

module.exports = function validateEditUser(data) {
  let errors = {};
  let user ={};
  
  if (!Validator.isEmpty(data.name)) {
    user.name = data.name;
  }  
  if (Validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }
  if (!Validator.isEmpty(data.email)) {
    if (!Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }
    else user.email = data.email;
  }
  if (!Validator.isEmpty(data.newPassword)){
    if (!Validator.equals(data.newPassword, data.passwordConfirmation)) {
      errors.passwordConfirmation = 'Passwords must match';
    }
    else user.password =  bcrypt.hashSync(data.newPassword, 10); 
  }  
  
  return {
    errors,
    isValid: isEmpty(errors),
    user
  }
}