import axios from 'axios';
import setAutorizationToken from '../utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';
import {setCurrentUser} from './authActions';


export function getEditUser(id) {
  	return dispatch => {
		return axios.get('/users/edit/'+id);
  	}
}

export function editUser(data) {
  	return dispatch => {
		return axios.put('/users/edit', data).then(
			(response) => {
				if (response.data.token) {
					const token = response.data.token;
			        localStorage.setItem('jwtToken', token); 
			        setAutorizationToken(token);
			        dispatch(setCurrentUser(jwt.decode(token)));
				}
				return response;		        
			});
  	}
}