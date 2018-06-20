import axios from 'axios';
/*import setAutorizationToken from '../utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';*/
import {SET_NUMBER_TABS} from './types'

export function setNumberTabs(number){	
	return {
		type: SET_NUMBER_TABS,
		number
	};
}

export function getUsers() {
  	return dispatch => {
		return axios.get('/users');
  	}
}

export function deleteUser(id) {
  	return dispatch => {
		return axios.delete('/users/delete/'+id);
  	}
}

//получения всех задач для админа
export function getTasks() {
    return dispatch => {
    return axios.get('/tasks');
    }
}

//все пользователи с задачами
export function getUsersTasks(){
    return dispatch => {
    return axios.get('/tasks/users');
    }
}