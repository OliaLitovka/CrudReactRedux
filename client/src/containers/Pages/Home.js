import React, { Component } from 'react';
import LoginForm from '../../components/forms/LoginForm';
import UserTasks from '../../components/UserTasks';
import AdminContent from '../AdminContent';
import { connect } from 'react-redux';
import { login } from '../../actions/authActions';
import { getUserTasks, deleteTask } from '../../actions/taskActions';

class HomePage extends Component {
  render() {
  	const {login, auth, getUserTasks, deleteTask} = this.props;
    return (     
      <div className="Home">  
      	{auth.isAuthenticated ? 
          auth.user.name === 'admin' ? 
            <AdminContent/> : 
            <div>
              <h1>Tasks</h1>
              <UserTasks 
                getUserTasks = {getUserTasks} 
                deleteTask = {deleteTask} 
                user = {auth.user}
              /> 
            </div>: 
          <LoginForm login = {login}/>
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

export default connect(mapStateToProps, { login, getUserTasks, deleteTask })(HomePage);