import axios from 'axios';


//добавить задачу для пользователя
export function addAttr(data) {
  	return dispatch => {
		return axios.post('/tasks/add', data);
  	}
}
//заполнение формы редактирования программы
export function getEditTask(task_id){
  	return dispatch => {
		return axios.get('/tasks/edit/'+task_id);
  	}
}
//редактирование задачи
export function editTask(data) {
  	return dispatch => {
		return axios.put('/tasks/edit', data);
  	}
}
//залачи пользьзователя
export function getUserTasks(id){
  	return dispatch => {
		return axios.get('/tasks/user?id='+id);
  	}
}


export function deleteTask(id) {
  	return dispatch => {
		return axios.delete('/tasks/delete/'+id);
  	}
}