import { /*createStore,*/ combineReducers } from 'redux';
import auth from './auth';
import admin from './admin';

export default combineReducers({
  auth,
  admin
});

/*var store = createStorek(admin);*/