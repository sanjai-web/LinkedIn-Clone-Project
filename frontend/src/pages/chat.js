import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchCurrentUser, fetchMessages, sendMessage, fetchUnreadMessages } from '../actions/chatActions';
import "../styles/chat.css";
import { MdAccountCircle } from "react-icons/md";
const Chat = () => {
  const dispatch = useDispatch();
  const { users, currentUser, messages, unreadMessages } = useSelector(state => state.chat);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCurrentUser());
    dispatch(fetchUnreadMessages());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);

  const handleSendMessage = () => {
    if (selectedUser && message.trim()) {
      dispatch(sendMessage(selectedUser._id, message));
      setMessage('');
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //search

  const filteredUsers = users
    .filter(user => user !== null)
    .filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3 className='chat-header'>Users</h3>
        <div className="content-chat">
          <input
            className="search-user-chat"
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {filteredUsers.map(user => (
            <div
              key={user._id}
              className="user-item"
              onClick={() => handleUserClick(user)}
            >
              {user.profileImageUrl ? (
                <img
                  src={`http://localhost:3001${user.profileImageUrl}`}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              ) : (
                <MdAccountCircle style={{ width: '40px', height: '40px' }} />
              )}
              <p className='user-chat'>{user.firstName} {user.lastName}</p>
              {unreadMessages[user._id] > 0 && (
                <span className="unread-badge">{unreadMessages[user._id]}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-window">
        {selectedUser && (
          <>
            <h3 className='chat-header-name'>
              {selectedUser.profileImageUrl ? (
                <img
                  src={`http://localhost:3001${selectedUser.profileImageUrl}`}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                />
              ) : (
                <MdAccountCircle style={{ width: '40px', height: '40px' }} />
              )}
              <span className='pro-name'>
              {selectedUser.firstName} {selectedUser.lastName}</span>
            </h3>
            <div className="messages">
              {messages.map(msg => (
                <div key={msg._id} className={msg.senderId === currentUser._id ? 'message outgoing' : 'message incoming'}>
                  <b>{msg.senderId === currentUser._id ? 'You' : selectedUser.firstName}:</b> {msg.message}
                </div>
              ))}
            </div>
            <div className="send-message">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
