import io from 'socket.io-client';
import { authenticationService } from './authenticationService';


export const connect = (userid) => {
  const currentUser = authenticationService.currentUserValue;
  const token=currentUser.token.split(' ')[1]
  const socket = io('http://localhost:5000',{
    query: { token: token },
  });
  socket.emit('join',userid)
  return socket;
}


export const connectSocket = () => (dispatch) => {
 const socket=connect()

  dispatch({ type: "CONNECT", payload: socket });


  socket.on('gmessages', (data) => {
    dispatch({type:"ADD_GLOBAL_MESSAGE",payload:data});
  });

  socket.on('messages', (data) => {
    dispatch({type:"ADD_PERSONAL_MESSAGE",payload:data});
  });

 

};


export const disconnectSocket = () =>
 ({
  type: "DISCONNECT",
});
