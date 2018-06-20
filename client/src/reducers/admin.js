import {SET_NUMBER_TABS} from '../actions/types';
var initialState = {	
	numberTab: 1
};

export default (state = initialState, action = {}) =>{
	switch(action.type){
		case SET_NUMBER_TABS:
			return{				
				numberTab: action.number
			};
		default: return state;
	}
}
