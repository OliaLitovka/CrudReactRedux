import axios from 'axios';
import setAutorizationToken from '../utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';
import {SET_CURRENT_USER} from './types'

export function setCurrentUser(user){
	return {
		type: SET_CURRENT_USER,
		user
	};
}

export function logout(){
	return dispatch =>{
		localStorage.removeItem('jwtToken');
		setAutorizationToken(false);
		dispatch(setCurrentUser({}));
	} 		
}

export function login(data) {
  	return dispatch => {
		return axios.post('/auth?h=y', data).then(
			(response) => {
		        const token = response.data.token;
		        localStorage.setItem('jwtToken', token); 
		        setAutorizationToken(token);
		        dispatch(setCurrentUser(jwt.decode(token)));
			});
  	}
}