// reducers/chatReducer.js
import {
    FETCH_USERS_SUCCESS,
    FETCH_CURRENT_USER_SUCCESS,
    FETCH_MESSAGES_SUCCESS,
    SEND_MESSAGE_SUCCESS,
    FETCH_UNREAD_MESSAGES_SUCCESS,
  } from '../actions/chatActions';
  
  const initialState = {
    users: [],
    currentUser: null,
    messages: [],
    unreadMessages: {},
  };
  
  const chatReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_USERS_SUCCESS:
        return { ...state, users: action.payload };
      case FETCH_CURRENT_USER_SUCCESS:
        return { ...state, currentUser: action.payload };
      case FETCH_MESSAGES_SUCCESS:
        return { ...state, messages: action.payload };
      case SEND_MESSAGE_SUCCESS:
        return state; // No state update needed here, messages are fetched again
      case FETCH_UNREAD_MESSAGES_SUCCESS:
        return { ...state, unreadMessages: action.payload };
      default:
        return state;
    }
  };
  
  export default chatReducer;
  