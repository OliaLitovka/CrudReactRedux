import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router'; 
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import Routes from './routes'; 

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import rootReducer from './reducers';
import setAuthorizationToken from './utils/setAuthorizationToken';
import {setCurrentUser} from './actions/authActions';
import jwt from 'jsonwebtoken';

const store = createStore(
	rootReducer, 
	compose(
		applyMiddleware(thunk),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	) );

if (localStorage.jwtToken){
	setAuthorizationToken(localStorage.jwtToken);
	store.dispatch(setCurrentUser(jwt.decode(localStorage.jwtToken)));
}

ReactDOM.render(
	<Provider store={store}>
		<Routes history={browserHistory} />
	</Provider>,
    document.getElementById('root')
);
registerServiceWorker();
