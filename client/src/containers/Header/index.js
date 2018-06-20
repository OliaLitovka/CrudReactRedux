import React, { Component } from 'react';
import './style.css';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import {logout} from '../../actions/authActions';
import GuestLinks from '../../components/headerLinks/GuestLinks';
import UserLinks from '../../components/headerLinks/UserLinks';
import { Collapse, Navbar} from 'reactstrap';

class Header extends Component {
    
  render() {
    const { logout } = this.props;
    const { isAuthenticated, user } = this.props.auth;     
    return (
      <div className="header">
       <Navbar color="dark" dark expand="md">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">CRUD</Link>
          </div>            
          <Collapse navbar>            
              { isAuthenticated ? 
                <UserLinks 
                  logout = {logout} 
                  user = {user}
                /> : 
                <GuestLinks/> 
              }           
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    auth: state.auth
  };
}

export default connect(mapStateToProps, {logout})(Header);
