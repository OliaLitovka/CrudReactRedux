import React, { Component } from 'react';
import { Link } from 'react-router';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Nav, NavItem} from 'reactstrap';
import { browserHistory } from 'react-router'

class UserLinks extends Component {
    constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };

    this.toggle = this._toggle.bind(this);
    this.logout = this._logout.bind(this);
  }

  _logout(e){
    e.preventDefault();
    this.props.logout();
    browserHistory.push('/')
  }

  _toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    const user = this.props.user;
    return (
      <Nav className="ml-auto" navbar>
        <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle nav caret>
            {user && user.name}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>User menu</DropdownItem>
            <Link to="/users/edit">
              <DropdownItem>Edit</DropdownItem>
            </Link>
            <Link to="/tasks/add">
              <DropdownItem>Add task</DropdownItem>
            </Link>
            <DropdownItem divider />
            <Link to="/">
              <DropdownItem>All tasks</DropdownItem>
            </Link>
          </DropdownMenu>
        </Dropdown>
        <NavItem>        
          <Link to="/" onClick={this.logout} className="nav-link">Logout</Link>
        </NavItem>
      </Nav>
    );
  }
}

export default UserLinks;
