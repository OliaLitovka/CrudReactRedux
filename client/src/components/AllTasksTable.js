import React, { Component } from 'react';
import { Link } from 'react-router';
import { Alert, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AllTasksTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      visible: false,
      modal: false,
      errors:{},
      alertColor: "success",
      msg: '',
      id:0
    };
    this.openModal = this._openModal.bind(this);
    this.deleteUser = this._deleteUser.bind(this);
    this.toggle = this._toggle.bind(this);
    this.isOpen = this._isOpen.bind(this);
    this.onDismiss = this._onDismiss.bind(this);

  }

  componentDidMount() {   
   this.setState({errors: {}});  
    this.props.getTasks().then(
      (response) => {
        this.setState({ 
          tasks: response.data
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

  _onDismiss() {
    this.setState({ visible: false});
  }
  _isOpen() {
    this.setState({ visible: true});
  }
 _openModal(Id) { 
    this.setState({
      modal: true,
      id: Id
    });
  }  
  _toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  _deleteUser(){
    if (this.state.visible) this.onDismiss();
    this.props.deleteTask(this.state.id).then(
      (response)=> {      
        this.setState({ 
            msg: 'success',
            alertColor: 'success'
        });    
        this.isOpen();
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
    const {tasks, alertColor, msg} = this.state;
    return (
      <div className="container">
        <Alert className="col-md-4 offset-md-4" color={alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
          {msg}
        </Alert>         
          <Table hover striped>
          <thead>
            <tr> 
              <th>#</th>
              <th>Subject</th>             
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>           
            <tbody>
              {tasks.map((task, index) =>
              <tr key={index}>     
                <th scope="row">{index+1}</th>      
                <td>{task.subject}</td>
                <td>{task.description}</td>
                <td>{task.date}</td>
                <td>               
                    <Link to={`/tasks/edit/${task.id}`} className="btn btn-outline-dark">Edit task</Link>{" "}                       
                    <Button outline color="danger" onClick={() => this.openModal(task.id)}>Delete task</Button>                    
                </td>
              </tr>
              )}
            </tbody>             
          </Table>
        
          <Modal isOpen={this.state.modal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
          toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Delete</ModalHeader>
            <ModalBody>
              Are you sure you want to delete this user?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={this.deleteUser}>Yes</button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>                 
      </div>
    );
  }
}
export default AllTasksTable;
