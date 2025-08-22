import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';  // Correct way to import redux-thunk
import rootReducer from './reducers'; // Assuming you have an index.js in your reducers folder

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
