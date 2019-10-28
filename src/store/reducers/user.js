import * as actionTypes from '../actions';
import axios from '../../axios-base';
const initialState = {
    logged_in: localStorage.getItem('token') ? true : false,
    userData: {},
    isManager: false,
    connectedUsers: [],
    userGroupId: null,
    groups: [],
    unchoosenworkerCounter: 2
}


const reducer = (state = initialState, action) => {
    if(action.type==actionTypes.ADD_USERDATA){
        
        let is_manager=false;
        if (action.userData.isManager===true){
            is_manager=true
        }
        // if(action.userData.groups.filter((el)=>el.name==="managment").length>0){
        //     is_manager=true;
        // }
     
        return {
            ...state,
            userData: action.userData,
            isManager: is_manager,
        }
    }
    if(action.type==actionTypes.ADD_CONNECTED_USERS){
       
        return {
            ...state,
           connectedUsers: action.connectedUsers,
            
        }
    }
    if(action.type==actionTypes.ADD_GROUPS){
       
        return {
            ...state,
           groups: action.groups,
            
        }
    }

    if(action.type==actionTypes.ADD_USER_GROUP_ID){
        
        return {
            ...state,
           userGroupId: action.userGroupId,
            
        }
    }
    if(action.type==actionTypes.LOGIN){
        
        return {
            ...state,
           logged_in: true,
            
        }
    }
    if(action.type==actionTypes.LOGOUT){
        
        return {
            ...state,
           logged_in: false,//tu więcej np isManager: false
            
        }
    }
    if(action.type==actionTypes.GET_UNCHOOSENWORKER_COUNTER){
        // axios.get('/api/docs/unchoosencounter',{
        //     headers: {
        //       'x-auth-token': localStorage.getItem('token')
        //   }
        // }).then(response => {
         
        //    console.log("Response in add redux unchoosen", response.data.count)
        //    return {
        //     ...state,
        //     unchoosenworkerCounter: response.data.count

        // }
            
              
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
        return {
            ...state,
            unchoosenworkerCounter: action.cnt
        }
        
        
    }
   
    return state
}

export default reducer