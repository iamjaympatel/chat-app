import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import { Chatreducer }from './Redux/ChatReducer';
import { composeWithDevTools } from 'redux-devtools-extension'


export const middlewares = [thunk];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const rootReducer=combineReducers({
    Chat:Chatreducer
})


const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export default store;
