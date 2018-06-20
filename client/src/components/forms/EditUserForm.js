import React, {Component} from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Alert, FormFeedback, FormText, FormGroup} from 'reactstrap';

const required = (value) => {
  if (!value.toString().trim().length) {
    return <FormFeedback>This field is required</FormFeedback>;
  }
};
const validPassword = (value, props, components) => { 
  if (value !== components['newPassword'][0].value) { // components['password'][0].value !== components['confirm'][0].value
    return <FormFeedback>Passwords are not equal.</FormFeedback>
  }
};

class EditUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formShowRender: true,
      name: '',
      email: '',
      password: '',
      newPassword: '',
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

  componentDidMount() {
    const {auth, getEditUser, query} = this.props;
    if (auth.user){
      let id = auth.user.id; 
      if (query.user) id = query.user;
      getEditUser(id).then(
      (response) => {
        if (response.data.form){
          this.setState({ 
            msg: response.data.form,
            alertColor: 'warning',
          });
          this.isOpen();
        }   
        else if (response.data[0]) {
          const data = response.data[0];
          this.setState({ 
            name: data.name,
            email: data.email          
          });  
        }  
      }
    ).catch(
      (error) => {         
        this.setState({ 
            msg: 'Server error',
            alertColor: 'danger'
        });
        const errors = error.response.data;
        if (errors){
          this.setState({ errors: errors});
          if (errors.form){
            this.setState({ 
              msg: errors.form
            });
          }       
        }   
        this.isOpen(); 
    });

    }
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
      newPassword: this.state.newPassword,
      passwordConfirmation: this.state.passwordConfirmation
    }    
    if (this.props.query.user) data.userId = this.props.query.user;
    this.props.editUser(data).then(
      (response) => {
        this.setState({ 
          msg: 'User successfully edited',
          alertColor: 'success'
        });
        if (response.data.form){
          this.setState({ 
            msg: response.data.form,
            alertColor: 'secondary',
          });
        }          
        this.isOpen();
      }
    ).catch(
      (error) => {
        console.log(error);
        this.setState({ 
            msg: 'Server error. User not edited',
            alertColor: 'danger'
        });
        const errors = error.response.data;
        if (errors){
          this.setState({ errors: errors});
          if (errors.form){
            this.setState({ 
              msg: errors.form
            });
          }       
        }  
        this.isOpen(); 
      });﻿
  }

  render() {  
    const {errors, name, email, password, newPassword, passwordConfirmation, msg, alertColor} = this.state;   
    return (
      <div>
        <h1>Edit user</h1>
        <Alert color={alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
          {msg}
        </Alert>
        <Form onSubmit={this.onSubmit}>            
            <FormGroup>
               <Input type="text" name="name" className="form-control" value={name} placeholder="Username" onChange={this.onChange} />                           
               {errors.userName && <small className="form-text text-danger">{errors.userName}</small>} 
            </FormGroup>
            <FormGroup>
              <Input type="text" name="email" className="form-control" value={email} placeholder="Email" onChange={this.onChange} />
              {errors.email && <small className="form-text text-danger">{errors.email}</small>}                            
              {errors.userEmail && <small className="form-text text-danger">{errors.userEmail}</small>} 
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" className="form-control" value={password} placeholder="Your password" onChange={this.onChange} validations={[required]}/>
               {errors.password && <small className="form-text text-muted">{errors.password}</small>}   
               <FormText>Enter password.</FormText>            
            </FormGroup>
            <FormGroup>
              <Input type="password" name="newPassword" className="form-control" value={newPassword} placeholder="New password" onChange={this.onChange}/>
               {errors.password && <small className="form-text text-muted">{errors.password}</small>}
            </FormGroup>
            <FormGroup>
              <Input type="password" name="passwordConfirmation" className="form-control" value={passwordConfirmation} placeholder="Password confirmation" onChange={this.onChange} validations={[validPassword]}/>
               {errors.passwordConfirmation && <small className="form-text text-muted">{errors.passwordConfirmation}</small>}
            </FormGroup>
            <Button className="btn btn-primary btn-lg">Edit user</Button>            
        </Form>        
      </div>      
    );
  }
}

export default EditUserForm;