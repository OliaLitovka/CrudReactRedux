import React, {Component} from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Alert, FormFeedback, FormGroup} from 'reactstrap';

const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return <FormFeedback>This field is required</FormFeedback>;
  }
}; 

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
      errors: {},
      visible: false,
      alertColor: "success",
      msg: ''
    }

    this.onChange = this._onChange.bind(this);
    this.onSubmit = this._onSubmit.bind(this);
    this.isOpen = this._isOpen.bind(this);
    this.onDismiss = this._onDismiss.bind(this);
  }

  _onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  _isOpen() {
    this.setState({ visible: true});
  }
  _onDismiss() {
    this.setState({ visible: false});
  }
  _onSubmit(e) {
    this.setState({ errors:{} });
    e.preventDefault();
    if(this.state.visible) this.onDismiss();
    let data = {
      identifier: this.state.identifier,
      password: this.state.password
    }    
    this.props.login(data).catch(
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
  render() {  
    const {errors, identifier, password,  msg, alertColor} = this.state;   
    return (
      <div className="col-md-4 offset-md-4">
        <h1>Login</h1>
        <Alert color={alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
          {msg}
        </Alert>        
        <Form onSubmit={this.onSubmit}>            
          <FormGroup>
             <Input type="text" name="identifier" className="form-control" value={identifier} placeholder="Username / Email" onChange={this.onChange}  validations={[required]}/>
             {errors.userName && <small className="form-text text-danger">{errors.userName}</small>}                
          </FormGroup>              
          <FormGroup>
            <Input type="password" name="password" className="form-control" value={password} placeholder="Password" onChange={this.onChange} validations={[required]}/>
             {errors.password && <small className="form-text text-muted">{errors.password}</small>}                 
          </FormGroup>           
          <Button className="btn btn-primary btn-lg">Login</Button>            
        </Form>
        
      </div>      
    );
  }
}
export default LoginForm;