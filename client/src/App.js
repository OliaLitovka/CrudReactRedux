import React, { Component } from 'react';
import './App.css';
/*import './font-awesome.min.css';*/
import 'bootstrap/dist/css/bootstrap.css'
import Header from './containers/Header';

class App extends Component {
  render() {
    return (
      <div className="App">  
         <Header/>  
         {this.props.children}  
      </div>
    );
  }
}

export default App;
