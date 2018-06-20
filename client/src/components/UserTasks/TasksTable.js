import React, { Component } from 'react';
import { Link } from 'react-router';
import { Alert, Button, Table } from 'reactstrap';

class TaskTable extends Component {	 
  render() {
    const {userTasks, openModal, errors} = this.props;

    return (
      <div className="container">        
        {errors.length && 
          <Alert className="col-md-4 offset-md-4" isOpen='true' color='danger'>
            Server error
          </Alert> 
        }  
        <Table hover>
          <thead>
            <tr> 
              <th>#</th>
              <th>Subject</th>             
              <th>Description</th>
              <th>Date</th> 
              <th>Action</th>
            </tr>
          </thead>           
            <tbody>
              {userTasks.map((userTask, index) =>
              <tr key={index}>     
                <th scope="row">{index+1}</th>      
                <td>{userTask.subject}</td>
                <td>{userTask.description}</td>
                <td>{userTask.date}</td>
                <td>               
                    <Link to={`/tasks/edit/${userTask.id}`} className="btn btn-outline-dark">Edit task</Link>{" "}                       
                    <Button outline color="danger" onClick={() => openModal(userTask.id)}>Delete task</Button>                    
                </td>
              </tr>
              )}
            </tbody>             
          </Table>                 
      </div>
    );
  }
}
export default TaskTable;
