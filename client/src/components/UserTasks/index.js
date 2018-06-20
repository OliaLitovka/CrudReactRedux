import React, { Component } from 'react';
import TasksTable from './TasksTable';
import {Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class UserTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userTasks: [],
      visible: false,
      modal: false,
      errors:{},
      alertColor: "success",
      msg: '',
      id:0
   	};
   	this.openModal = this._openModal.bind(this);
    this.deleteTask = this._deleteTask.bind(this);
    this.toggle = this._toggle.bind(this);
    this.isOpen = this._isOpen.bind(this);
    this.onDismiss = this._onDismiss.bind(this);

  }

  componentDidMount() {  	
    this.setState({errors: {}});
  	const user = this.props.user;    
  	this.props.getUserTasks(user.id).then(
      (response) => {
        this.setState({ 
          userTasks: response.data
        });    
      }
    ).catch(
      (error) => {         
        this.setState({ 
            msg: 'Sorry! Server is temporarily down',
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
  _isOpen() {
    this.setState({ visible: true});
  }
  _onDismiss() {
    this.setState({ visible: false});
  }
  	_openModal(taskId) { 
      this.setState({
        modal: true,
        id: taskId
      });
    } 
    _toggle() {
      this.setState({
        modal: !this.state.modal
      });
    }

    _deleteTask(){
    	this.props.deleteTask(this.state.id).then(
        (response)=> {          
          this.componentDidMount();
          this.toggle();
        }
      ).catch(
        (error) => {         
         this.setState({ 
            msg: 'Server error',
            alertColor: 'danger',
            modal: false
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
    const {userTasks, errors, msg, alertColor} = this.state;
    return (
      <div className="container">
        {userTasks.length ? 
          <TasksTable
            userTasks = {userTasks}
            openModal = {this.openModal}
            errors = {errors}
          /> :
          errors.length ?
            <Alert className="col-md-4 offset-md-4" color={alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
              {msg}
            </Alert> :
            <span>You don't have tasks</span>
        }
        <Modal isOpen={this.state.modal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
          toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Delete</ModalHeader>
            <ModalBody>
              Are you sure you want to delete this task?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={this.deleteTask}>Yes</button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>        
      </div>
    );
  }
}
export default UserTasks;
