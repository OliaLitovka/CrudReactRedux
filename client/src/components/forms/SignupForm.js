import React, {Component} from 'react';
import validator from 'validator';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Alert, FormFeedback, FormText, FormGroup} from 'reactstrap';

const required = (value) => {
  if (!value.toString().trim().length) {
    return <FormFeedback>This field is required</FormFeedback>;
  }
}; 
const validEmail = (value) => {
  if (!validator.isEmail(value)) {
    return <FormFeedback>It's not a valid email.</FormFeedback>
  }
}; 
const minLen = (value, props) => {
  // get the minLength from component's props
  if (value.length <= props.minLength) {
    return <FormFeedback>Password is too short.</FormFeedback>
  }
}; 
const validPassword = (value, props, components) => { 
  if (value !== components['password'][0].value) { // components['password'][0].value !== components['confirm'][0].value
    return <FormFeedback>Passwords are not equal.</FormFeedback>
  }
};

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formShowRender: true,
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      visible: false,
      alertColor: "success",
      msg: ''
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.isOpen = this.isOpen.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  isOpen() {
    this.setState({ visible: true});
  }
  onDismiss() {
    this.setState({ visible: false});
  }
  onSubmit(e) {
    this.setState({ errors:{} });
    e.preventDefault();
    if(this.state.visible) this.onDismiss();
    let data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirmation: this.state.passwordConfirmation
    }    
    this.props.userSignupRequest(data).then(
      (response) => {
        this.setState({ 
          msg: 'User successfully added',
          alertColor: 'success',
          formShowRender: false
        });      
        this.isOpen();
      }
    ).catch(
      (error) => {
        this.setState({ 
            msg: 'Server error. User not added',
            alertColor: 'danger'
        });
        const errors = error.response.data;
        if (errors) this.setState({ errors: errors});
        this.isOpen(); 
      });﻿
  }

  render() {  
    const {formShowRender, errors, name, email, password, passwordConfirmation, msg, alertColor} = this.state;   
    return (
      <div>
        <h1>Registration</h1>
        <Alert color={alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
          {msg}
        </Alert>
        {formShowRender &&
          <Form onSubmit={this.onSubmit}>            
              <FormGroup>
                 <Input type="text" name="name" className="form-control" value={name} placeholder="Username" onChange={this.onChange}  validations={[required]}/>                
                 {errors.name && <small className="hform-text text-muted">{errors.name}</small>}
                 {errors.userName && <small className="form-text text-danger">{errors.userName}</small>}                
              </FormGroup>
              <FormGroup>
                <Input type="text" name="email" className="form-control" value={email} placeholder="Email" onChange={this.onChange} validations={[required, validEmail]}/>
                {errors.email && <small className="form-text text-muted">{errors.email}</small>}
                {errors.userEmail && <small className="form-text text-danger">{errors.userEmail}</small>}                
              </FormGroup>
              <FormGroup>
                <Input type="password" name="password" className="form-control" value={password} placeholder="Password" onChange={this.onChange} minLength="5" validations={[required, minLen]}/>
                 {errors.password && <small className="form-text text-muted">{errors.password}</small>}
                 <FormText>Must be more than 5 characters.</FormText>
              </FormGroup>
              <FormGroup>
                <Input type="password" name="passwordConfirmation" className="form-control" value={passwordConfirmation} placeholder="Password confirmation" onChange={this.onChange} validations={[required, validPassword]}/>
                 {errors.passwordConfirmation && <small className="form-text text-muted">{errors.passwordConfirmation}</small>}
              </FormGroup>
              <Button className="btn btn-primary btn-lg">Sign up</Button>            
          </Form>
        }
      </div>      
    );
  }
}

export default SignupForm;