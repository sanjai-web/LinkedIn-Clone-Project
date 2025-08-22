import { combineReducers } from 'redux';
import postsReducer from './postsReducer';
import userReducer from './userReducer'; // Assuming you have a user reducer
import chatReducer from './chatReducer';
const rootReducer = combineReducers({
  posts: postsReducer,
  user: userReducer,
  chat: chatReducer,
});

export default rootReducer;
