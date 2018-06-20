import React, {Component} from 'react';
import TaskForm from '../../components/forms/TaskForm';
import { connect } from 'react-redux';
import { addTask } from '../../actions/taskActions';

class AddTaskPage extends Component {
  render() {
    const {addTask, auth} = this.props;
    const {isAuthenticated} = auth;
    const params = {title: 'Add task'};
    return (      
      <div className="col-md-4 offset-md-4">
        { isAuthenticated ? 
          <TaskForm 
            action={addTask} 
            auth = {auth} 
            params = {params} 
          />  : 
          <div>Login to add a task</div>  
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

export default connect(mapStateToProps, {addTask})(AddTaskPage);