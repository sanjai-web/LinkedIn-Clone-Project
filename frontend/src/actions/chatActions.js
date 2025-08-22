// actions/chatActions.js
import axios from 'axios';

export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const FETCH_UNREAD_MESSAGES_SUCCESS = 'FETCH_UNREAD_MESSAGES_SUCCESS';

export const fetchUsers = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:3001/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: FETCH_USERS_SUCCESS, payload: response.data.filter(user => user !== null) });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const fetchCurrentUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:3001/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: FETCH_CURRENT_USER_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
};

export const fetchMessages = (userId) => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`http://localhost:3001/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: FETCH_MESSAGES_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

export const sendMessage = (receiverId, message) => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post('http://localhost:3001/messages', {
      receiverId,
      message,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: response.data });
    dispatch(fetchMessages(receiverId)); // Fetch messages again after sending
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const fetchUnreadMessages = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:3001/unread-messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: FETCH_UNREAD_MESSAGES_SUCCESS, payload: response.data });
  } catch (error) {
    console.error("Error fetching unread messages:", error);
  }
};
