import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../actions/userActions';
import { MdAccountCircle, MdEdit, MdSchool, MdWork, MdEmail, MdPhone, MdCalendarToday } from "react-icons/md";
import { FaGraduationCap, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "../styles/dashbord.css";

const Dashboard = () => {
  const [editMode, setEditMode] = useState(false);
  const [details, setDetails] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setDetails({
        college: user.college || '',
        degree: user.degree || '',
        branch: user.branch || '',
        graduationDate: user.graduationDate || '',
        mobileNumber: user.mobileNumber || '',
        yearsOfExperience: user.yearsOfExperience || '',
        workingPlace: user.workingPlace || '',
        domain: user.domain || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleInputChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/user/details', details, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setMessageType('success');
      dispatch(fetchUser());
      setEditMode(false);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error('Error updating details:', error);
      setMessage('Error updating details');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/user/profile-image', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      setMessageType('success');
      dispatch(fetchUser());
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile image:', error);
      setMessage('Error updating profile image');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  if (!user) return <div className="loading">Loading your educational profile...</div>;

  return (
    <>
      <div className='dashboard-container education-dashboard'>
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {user.role === 'teacher' ? <FaChalkboardTeacher /> : <FaUserGraduate />}
            Education Profile
          </h1>
          <div className="dashboard-actions">
            <button onClick={() => setEditMode(true)} className="edit-button">
              <MdEdit /> Edit Profile
            </button>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>

        {message && (
          <div className={`message-banner ${messageType}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-section">
            <div className="profile-image-container">
              {user.profileImageUrl ? (
                <img 
                  src={`http://localhost:3001${user.profileImageUrl}`} 
                  alt="Profile" 
                  className="profile-image"
                />
              ) : (
                <MdAccountCircle className="profile-image-default" />
              )}
              <label htmlFor="profile-image-upload" className="image-upload-label">
                Change Photo
              </label>
              <input 
                id="profile-image-upload"
                type="file" 
                onChange={handleProfileImageChange} 
                accept="image/*"
                className="image-upload-input"
              />
            </div>

            <div className="user-basic-info">
              <h2 className="user-name">{user.firstName} {user.lastName}</h2>
              <div className="user-role-badge">
                {user.role === 'teacher' ? 'Educator' : 'Student'}
              </div>
              <p className="user-email"><MdEmail /> {user.email}</p>
            </div>
          </div>

          <div className="details-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label"><MdPhone /> Mobile Number</span>
                <span className="info-value">{user.mobileNumber || 'Not provided'}</span>
              </div>

              {user.role === 'student' && (
                <>
                  <div className="info-item">
                    <span className="info-label"><MdSchool /> College/School</span>
                    <span className="info-value">{user.college || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><FaGraduationCap /> Degree</span>
                    <span className="info-value">{user.degree || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><MdSchool /> Branch</span>
                    <span className="info-value">{user.branch || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><MdCalendarToday /> Graduation Date</span>
                    <span className="info-value">
                      {user.graduationDate ? new Date(user.graduationDate).toLocaleDateString() : 'Not provided'}
                    </span>
                  </div>
                </>
              )}

              {user.role === 'teacher' && (
                <>
                  <div className="info-item">
                    <span className="info-label"><FaGraduationCap /> Degree</span>
                    <span className="info-value">{user.degree || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><MdSchool /> Branch</span>
                    <span className="info-value">{user.branch || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><MdWork /> Years of Experience</span>
                    <span className="info-value">{user.yearsOfExperience || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><MdWork /> Working Place</span>
                    <span className="info-value">{user.workingPlace || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label"><MdWork /> Domain</span>
                    <span className="info-value">{user.domain || 'Not provided'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {editMode && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Your Profile</h2>
                <button className="close-button" onClick={() => setEditMode(false)}>&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
                  {user.role === 'teacher' ? (
                    <>
                      <div className="form-group">
                        <label>Degree</label>
                        <input 
                          name="degree" 
                          placeholder="e.g., M.Tech, Ph.D" 
                          value={details.degree} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Branch</label>
                        <input 
                          name="branch" 
                          placeholder="e.g., Computer Science" 
                          value={details.branch} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Years of Experience</label>
                        <input 
                          name="yearsOfExperience" 
                          type="number"
                          placeholder="e.g., 5" 
                          value={details.yearsOfExperience} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Working Place</label>
                        <input 
                          name="workingPlace" 
                          placeholder="e.g., Stanford University" 
                          value={details.workingPlace} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Domain</label>
                        <input 
                          name="domain" 
                          placeholder="e.g., Artificial Intelligence" 
                          value={details.domain} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>College/School</label>
                        <input 
                          name="college" 
                          placeholder="e.g., Harvard University" 
                          value={details.college} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Degree</label>
                        <input 
                          name="degree" 
                          placeholder="e.g., B.Tech, B.Sc" 
                          value={details.degree} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Branch</label>
                        <input 
                          name="branch" 
                          placeholder="e.g., Computer Science" 
                          value={details.branch} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Graduation Date</label>
                        <input 
                          name="graduationDate" 
                          type="date" 
                          value={details.graduationDate} 
                          onChange={handleInputChange} 
                        />
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      name="mobileNumber" 
                      placeholder="e.g., +1 234-567-8900" 
                      value={details.mobileNumber} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setEditMode(false)} className="cancel-button">
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;