const INTIAL_STATE = {
    socket: null,
  };
  
  const socketReducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
      case"CONNECT": {
        return {
          ...state,
          socket: action.payload,
        };
      }
      case"DISCONNECT": {
        state.socket && state.socket.disconnect();
        return INTIAL_STATE;
      }
      default: {
        return state;
      }
    }
  };
  
  export default socketReducer;
  