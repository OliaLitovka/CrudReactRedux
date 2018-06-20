import React, {Component} from 'react';
import EditUserForm from '../../components/forms/EditUserForm';
import { connect } from 'react-redux';
import {getEditUser, editUser} from '../../actions/userActions';

class EditUserPage extends Component {
  render() {
    const {getEditUser, editUser, auth} = this.props;
    const query = this.props.location.query;    
    return (      
      <div className="col-md-4 offset-md-4">
        { auth.isAuthenticated ? 
          <EditUserForm 
            editUser={editUser} 
            auth = {auth}  
            getEditUser={getEditUser}
            query = {query}
          />  : 
          <span>Login to edit this user</span>  
        }          
      </div>      
    );
  }
}

function mapStateToProps(state){
  return{
    auth: state.auth
  };
}

export default connect(mapStateToProps, {getEditUser, editUser})(EditUserPage);