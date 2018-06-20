import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './App';
import Home from './containers/Pages/Home'
import SignUp from './containers/Pages/SignUp';
import AddTask from './containers/Pages/AddTask';
import EditTask from './containers/Pages/EditTask';
import EditUser from './containers/Pages/EditUser';
import NotFound from './containers/Pages/NotFound';


const Routes = (props) => (
  <Router {...props}>
	  <Route path='/' component={App}>
	      <IndexRoute component={Home} />
		  <Route path='/signup' component={SignUp}/>
		  <Route path='/tasks/add' component={AddTask}/>
		  <Route path='/tasks/edit/:id' component={EditTask}/>
		  <Route path='/users/edit' component={EditUser}/>
		  <Route path="*" component={NotFound} />
	</Route>
  </Router>
);

export default Routes;