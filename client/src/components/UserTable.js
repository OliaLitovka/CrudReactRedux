import React, { Component } from 'react';
import { Link } from 'react-router';
import SearchBar from './SearchBar';
import { Alert, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      visible: false,
      modal: false,
      errors:{},
      alertColor: "success",
      msg: '',
      id:0,
      searchValue: '',
      filteredUsers: [],
      sortBy: false,
      order: false
    };
    this.openModal = this._openModal.bind(this);
    this.deleteUser = this._deleteUser.bind(this);
    this.toggle = this._toggle.bind(this);
    this.isOpen = this._isOpen.bind(this);
    this.onDismiss = this._onDismiss.bind(this);

  }

    sortByName = () => {
        this.setState({ 
          order: !this.state.order, 
          filteredUsers : this.state.filteredUsers.sort((a, b) => {
            return (this.state.order ? 1 : -1) * ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
        })
        }); 
    };
    sortByEmail = () => {
        this.setState({
            order: !this.state.order,
            filteredUsers : this.state.filteredUsers.sort((a, b) => {
                return (this.state.order ? 1 : -1) * ((a.email < b.email) ? -1 : (a.email > b.email) ? 1 : 0);
            })
        });
    };
     search = (val) => {
        const regex = new RegExp(val, 'i');
        this.setState({ 
          searchValue: val,
          filteredUsers: this.state.users.filter(el => regex.test(el.name))
        });     
    };

    

  componentDidMount() {   
   this.setState({errors: {}});  
    this.props.getUsers().then(
      (response) => {
        this.setState({ 
          users: response.data,
          filteredUsers: response.data
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
    this.props.deleteUser(this.state.id).then(
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
    const {alertColor, msg, filteredUsers} = this.state;
    return (
      <div className="container">
        <Alert className="col-md-4 offset-md-4" color={alertColor} isOpen={this.state.visible} toggle={this.onDismiss}>
          {msg}
        </Alert> 
        <SearchBar searchValue={this.state.searchValue} changeValue={this.search}/>  
        <Button outline color="primary" className="mr-2 mb-3 p-2 d-inline float-left" onClick={this.sortByName}>
          Sort by name
        </Button>
          <Button outline color="primary" className="mr-2 mb-3 p-2 d-inline float-left" onClick={this.sortByEmail}>
              Sort by email
          </Button>
          <Table hover striped>
          <thead>
            <tr> 
              <th>#</th>
              <th>Name</th>             
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>           
            <tbody>
              {filteredUsers.map((user, index) =>
              <tr key={index}>     
                <th scope="row">{index+1}</th>      
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>               
                    <Link to={`/users/edit?user=${user.id}`} className="btn btn-outline-dark">Edit user</Link>{" "}                       
                    <Button outline color="danger" onClick={() => this.openModal(user.id)}>Delete user</Button>                    
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
export default UserTable;
