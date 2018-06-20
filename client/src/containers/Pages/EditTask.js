import React, {Component} from 'react';
import TaskForm from '../../components/forms/TaskForm';
import { connect } from 'react-redux';
import {getEditTask, editTask} from '../../actions/taskActions';

class EditTaskPage extends Component {
  render() {
    const {getEditTask, editTask, auth} = this.props;
    const {isAuthenticated} = auth;
    const params = {
      title: 'Edit task',
      taskId: this.props.params.id
    };
    return (      
      <div className="col-md-4 offset-md-4">
        { isAuthenticated ? 
          <TaskForm 
            action={editTask} 
            auth = {auth} 
            params={params} 
            getEditTask={getEditTask}
          />  : 
          <span>Login to edit this task</span>  
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

export default connect(mapStateToProps, {getEditTask, editTask})(EditTaskPage);