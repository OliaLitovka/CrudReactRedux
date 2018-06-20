import React, { Component } from 'react';
import UserTasks from '../components/UserTasks';
import UsersTable from '../components/UserTable';
// import UsersTable from './UserTable';
import AllTasksTable from '../components/AllTasksTable';
import UsersTasksTable from '../components/UsersTasksTable';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { getUserTasks, deleteTask } from '../actions/taskActions';
import { setNumberTabs, getUsers, deleteUser, getTasks, getUsersTasks} from '../actions/adminActions';
import {TabContent, TabPane, Nav, NavItem, NavLink, Row, Col} from 'reactstrap';


class AdminContent extends Component {
  constructor(props) {    
    super(props);
    this.state = {
      activeTab: props.numberTab.toString()
    };   

    this.toggleTab = this._toggleTab.bind(this);
  }
  _toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
      this.props.setNumberTabs(tab);
    }
  }
  render() {
    const {auth, getUserTasks, deleteTask, getUsers, deleteUser, getTasks, getUsersTasks} = this.props;
    return (     
      <div className="container">
        <Nav tabs className = "mb-5">
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggleTab('1'); }}
            >              
            Your tasks
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggleTab('2'); }}
            >
              Users
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggleTab('3'); }}
            >
              All tasks
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => { this.toggleTab('4'); }}
            >
              User tasks
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <UserTasks 
                  getUserTasks = {getUserTasks} 
                  deleteTask = {deleteTask} 
                  user = {auth.user}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <UsersTable
                  getUsers = {getUsers}
                  deleteUser = {deleteUser}
                />
              </Col>              
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <AllTasksTable
                  getTasks={getTasks}
                  deleteTask = {deleteTask} 
                />
              </Col>              
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <UsersTasksTable
                  getUsersTasks ={getUsersTasks}
                />
              </Col>              
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    auth: state.auth,
    numberTab: state.admin.numberTab
  };
}

export default connect(mapStateToProps, {getUserTasks, deleteTask, getUsers, deleteUser, getTasks, getUsersTasks, setNumberTabs})(AdminContent);