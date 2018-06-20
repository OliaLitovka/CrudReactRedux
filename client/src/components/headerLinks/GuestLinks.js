import React, { Component } from 'react';
import { Link } from 'react-router';
import { Nav, NavItem} from 'reactstrap';

class GuestLinks extends Component {
  render() {    
    return (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <Link to="/signup" className="nav-link">Sign up</Link>
        </NavItem>
        <NavItem>
          <Link to="/" className="nav-link">Login</Link>
        </NavItem> 
      </Nav>
    );
  }
}

export default GuestLinks;
