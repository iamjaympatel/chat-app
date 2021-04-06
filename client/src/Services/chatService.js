import useHandleResponse from '../Utilities/handle-response';
import authHeader from '../Utilities/auth-header';
import { useSnackbar } from 'notistack';
import axios from 'axios'
import { authenticationService } from '../Services/authenticationService';
//import { async } from 'rxjs';rs

// Receive global messages
//const handleResponse = useHandleResponse();
//const { enqueueSnackbar } = useSnackbar();
export const GetGlobalMessages=()=>async(dispatch)=> {
    dispatch({type:"GLOBAL_CHAT_FETCHING"})
    try{
        const requestOptions = {
        headers: authHeader(),
    };
       const { data}= await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/global`,requestOptions )
       
       dispatch({type:"GLOBAL_CHAT_SUCCEESS",payload:data})
    }
    catch (err){
     //   enqueueSnackbar('Could not load Global Chat', {
       //   variant: 'error',}) 
    dispatch({type:"GLOBAL_CHAT_FAIL",payload:err})
        
        }

}

// Send a global message

export const UseSendGlobalMessage=(body)=>async(dispatch)=> {
    dispatch({type:"GLOBAL_CHAT_FETCHING"})
    try{
        const currentUser = authenticationService.currentUserValue;
     const requestOptions = {
            headers:authHeader(),
        
        };

    const {data}= await axios.post(`${process.env.REACT_APP_API_URL}/api/messages/global`,   { body: body},requestOptions)
    dispatch({type:"GLOBAL_CHAT_POST_SUCCESS",payload:data})
    
    }catch(err){
        dispatch({type:"GLOBAL_CHAT_FAIL",payload:err})
    }
}

// Get list of users conversations
export const UseGetConversations=()=>async(dispatch)=> {
    try{
      dispatch({type:"GET_CONVERSATION_FETCHING"})
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        headers:authHeader(),
    };
 const data = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/conversations`,requestOptions)
      dispatch({type:"GET_CONVERSATION_SUCCESS",payload:data})     
} 
catch(err){

    dispatch({type:"GET_CONVERSATION_FAIL",payload:err})
      };    
}

// get conversation messages based on
// to and from id's
export const UseGetConversationMessages=(id)=>async(dispatch)=> {

    dispatch({type:"PERSONAL_CHAT_FETCHING"})
    try{
    
    const currentUser = authenticationService.currentUserValue;

    const requestOptions = {
        headers: {authorization: `${currentUser.token}`},
    };
   const {data}= await axios.get(`${process.env.REACT_APP_API_URL }/api/messages/conversations/${id}`,requestOptions)
   
   dispatch({type:"PERSONAL_CHAT_SUCCESS",payload:data}) 
}    
   catch(err) {
       
   dispatch({type:"PERSONAL_CHAT_FAIL",payload:err})
console.log(err)
            }
    

}

export function useSendConversationMessage() {
    const { enqueueSnackbar } = useSnackbar();
    const handleResponse = useHandleResponse();

    const sendConversationMessage = (id, body) => {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ to: id, body: body }),
        };

        return fetch(
            `${process.env.REACT_APP_API_URL}/api/messages/`,
            requestOptions
        )
            .then(handleResponse)
            .catch(err => {
                console.log(err);
                enqueueSnackbar('Could send message', {
                    variant: 'error',
                });
            });
    };

    return sendConversationMessage;
}
