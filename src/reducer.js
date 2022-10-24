import { UPDATE_SEARCH, SET_LOADING, SET_ERROR, SET_DATA } from "./assets/actions";

const reducer = (state, action) => {
    if(action.type === SET_LOADING){
        return {...state, isLoading: true}
    }
    if(action.type === UPDATE_SEARCH){
        const { name, value } = action.payload;
        return {...state, [name]: value}
    }
    if(action.type === SET_ERROR){
        return {...state, error: {show: true, msg: action.payload}, isLoading: false}
    }
    if(action.type === SET_DATA){
        return {...state, objects: action.payload, error: {show: false, msg: ""} , showCard: true , isLoading: false}
    }
    else {
        console.log(`No action type for ${action.type}`);
        return state;
    }
}

export default reducer