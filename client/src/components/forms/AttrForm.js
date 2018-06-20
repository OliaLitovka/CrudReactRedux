import React, {Component} from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import Textarea from 'react-validation/build/textarea';

import 'react-datepicker/dist/react-datepicker.css';
import {Alert, FormFeedback, FormGroup} from 'reactstrap';

const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return <FormFeedback>This field is required</FormFeedback>;
  }
}; 

class AttrForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.params.title,
      subject: '',
      description: '',
      errors: {},
      visible: false,
      alertColor: "success",
      msg: ''
    }

    this.onChange = this._onChange.bind(this);
    this.onSubmit = this._onSubmit.bind(this);
    this.isOpen = this._isOpen.bind(this);
    this.onDismiss = this._onDismiss.bind(this);
    this.handleChange = this._handleChange.bind(this);
  }

  componentDidMount() {
    const {params, getEditTask} = this.props;
    if (params.taskId){
      getEditTask(params.taskId).then(
      (response) => {
        if (response.data.form){
          this.setState({ 
            msg: response.data.form,
            alertColor: 'warning',
          });
          this.isOpen();
        } else if(response.data[0]) {
          const data = response.data[0];
          this.setState({ 
            subject: data.subject,
            description: data.description
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

  _onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  _isOpen() {
    this.setState({ visible: true});
  }
  _onDismiss() {
    this.setState({ visible: false});
  }
  _handleChange(date) {
    this.setState({
      startDate: date
    });
  }
  _onSubmit(e) {
    this.setState({ errors:{} });
    e.preventDefault();
    const {subject, description, startDate, visible} = this.state;
    const {user} = this.props.auth;
    
    if(visible) this.onDismiss();    
    let data = {
      subject: subject,
      description: description,
      date: '',
      userId: user.id
    }  
    console.log(startDate);
    //проверка даты
    if (startDate) {
      data.date = startDate.format('YYYY-MM-DD');
    } else {
      this.setState({ errors:{date: 'This field is invalid'} });
    }
    if (this.props.params.taskId){
      data.taskId = this.props.params.taskId
    } 
    console.log(this.state.errors);
    !this.state.errors.date && this.props.action(data).then(
      (response) => {        
        if (response.data.form){
          this.setState({ 
            msg: response.data.form,
            alertColor: 'warning',
          });
        }  else {
          this.setState({ 
            msg: 'Success',
            alertColor: 'success'
          });
        }     
        this.isOpen(); 
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
  render() {  
    const {errors, subject, description, startDate,  msg, alertColor, visible, title} = this.state;  
    return (
      <div className="TaskForm">        
        <h1>{title}</h1>
        <Alert color={alertColor} isOpen={visible} toggle={this.onDismiss}>
          {msg}
        </Alert>
          <Form onSubmit={this.onSubmit} className="text-left">            
            <FormGroup>
               <Input 
                type="text" 
                name="subject" 
                className="form-control" 
                value={subject} 
                placeholder="Subject" 
                onChange={this.onChange}  
                validations={[required]}
              />
              {errors.subject && <small className="form-text text-danger">{errors.subject}</small>}                
            </FormGroup>              
            <FormGroup>
              <Textarea 
                name="description" 
                className="form-control" 
                value={description} 
                placeholder="Description..." 
                onChange={this.onChange} 
                validations={[required]}
              />
              {errors.description && <small className="form-text text-danger">{errors.description}</small>}                 
            </FormGroup> 
            <DatePicker 
                selected={startDate}
                onChange={this.handleChange}
                dateFormat="DD/MM/YYYY"
                className="mb-3"
            />     
            {errors.date && <small className="form-text text-danger">{errors.date}</small>}    
            <Button className="btn btn-primary btn-lg">{title}</Button>            
          </Form>
      </div>      
    );
  }
}

export default AttrForm;