
const initialstate={
    Globalchat:[],
    personalchat:[],
    error:{},
    loading:false,
    conversation:[]

}


export const Chatreducer=(state=initialstate,action)=>{
    switch(action.type){
        case"GLOBAL_CHAT_FETCHING":{
            return {...state,loading:true}
        }
        case"GLOBAL_CHAT_SUCCEESS":{
            return {...state,Globalchat:action.payload,loading:false}
        }
        case "ADD_GLOBAL_MESSAGE":{
            return{...state, loading:false, Globalchat:[...state.Globalchat,action.payload]}
        }
        case"GLOBAL_CHAT_FAIL":{
            return {...state,error:action.payload,loading:false}
        }
        case "GET_CONVERSATION_FETCHING":{
            return{...state,loading:true}
        }
        case "GET_CONVERSATION_SUCCESS":{
            return{...state, loading:false, conversation:action.payload.data}
        }
        case "GET_CONVERSATION_FAIL":{
            return{...state,loading:false,error:action.payload}
        }
        case "PERSONAL_CHAT_FETCHING":{
            return {...state,loading:true}
        }
        case "PERSONAL_CHAT_SUCCESS":{
            return{...state,loading:false, personalchat:action.payload}
        }
        case"ADD_PERSONAL_MESSAGE":{
            return{...state,loading:false, personalchat:[...state.personalchat,action.payload]}
         }
        case "PERSONAL_CHAT_FAIL":{
            return{...state,loading:false,error:action.payload}
        }
        default:
            return state;

    }
}