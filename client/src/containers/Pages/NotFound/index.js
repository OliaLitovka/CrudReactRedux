import React, { Component } from 'react';
import error from './404-error.jpg';
import './style.css';

class NotFound extends Component {

  render() {
	    return (
	      <div className="NotFound">
	        <img src={error} alt="404-notfound" />
	      </div>
	     );
	}
}

export default NotFound;
