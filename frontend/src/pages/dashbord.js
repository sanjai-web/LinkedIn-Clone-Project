import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../actions/userActions';
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import "../styles/dashbord.css";

const Dashboard = () => {
  const [editMode, setEditMode] = useState(false);
  const [details, setDetails] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    // Initialize the details state with the current user details when the user object changes
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
      dispatch(fetchUser());
      setEditMode(false);
      setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
    } catch (error) {
      console.error('Error updating details:', error);
      setMessage('Error updating details');
      setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/user/profile-image', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message);
      dispatch(fetchUser());
      setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
    } catch (error) {
      console.error('Error updating profile image:', error);
      setMessage('Error updating profile image');
      setTimeout(() => setMessage(''), 3000); // Clear the message after 3 seconds
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className='dashcontainer'>
        <h1 className="dash-title">Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
        
        {editMode && (
          <div className="popup">
            <div className="popup-content">
              <span className="close-button" onClick={() => setEditMode(false)}>&times;</span>
              <form onSubmit={handleSubmit}>
                {user.role === 'teacher' ? (
                  <>
                    <input name="degree" placeholder="Degree" value={details.degree} onChange={handleInputChange} />
                    <input name="branch" placeholder="Branch" value={details.branch} onChange={handleInputChange} />
                    <input name="yearsOfExperience" placeholder="Years of Experience" value={details.yearsOfExperience} onChange={handleInputChange} />
                    <input name="workingPlace" placeholder="Working Place" value={details.workingPlace} onChange={handleInputChange} />
                    <input name="domain" placeholder="Domain" value={details.domain} onChange={handleInputChange} />
                  </>
                ) : (
                  <>
                    <input name="college" placeholder="College/School" value={details.college} onChange={handleInputChange} />
                    <input name="degree" placeholder="Degree" value={details.degree} onChange={handleInputChange} />
                    <input name="branch" placeholder="Branch" value={details.branch} onChange={handleInputChange} />
                    <input name="graduationDate" type="date" value={details.graduationDate} onChange={handleInputChange} />
                  </>
                )}
                <input name="mobileNumber" placeholder="Mobile Number" value={details.mobileNumber} onChange={handleInputChange} />
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}

        {message && <p>{message}</p>}
        <center>
          {user.profileImageUrl ? (
            <img src={`http://localhost:3001${user.profileImageUrl}`} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
          ) : (
            <MdAccountCircle style={{ width: '150px', height: '150px' }} />
          )}
          <input type="file" onChange={handleProfileImageChange} />
        </center>
        <p><span>First Name: </span> {user.firstName}</p>
        <p><span>Last Name: </span>{user.lastName}</p>
        <p><span>Email: </span>{user.email}</p>
        <p><span>Role: </span>{user.role}</p>
        {user.role === 'teacher' && (
          <>
            <p><span>Degree: </span>{user.degree}</p>
            <p><span>Branch: </span>{user.branch}</p>
            <p><span>Years of Experience: </span>{user.yearsOfExperience}</p>
            <p><span>Working Place: </span>{user.workingPlace}</p>
            <p><span>Domain: </span>{user.domain}</p>
          </>
        )}
        {user.role === 'student' && (
          <>
            <p><span>College/School: </span>{details.college}</p>
            <p><span>Degree: </span>{user.degree}</p>
            <p><span>Branch: </span>{user.branch}</p>
            <p><span>Graduation Date: </span>{new Date(user.graduationDate).toLocaleDateString()}</p>
          </>
        )}
        <p><span>Mobile Number: </span>{user.mobileNumber}</p>
      </div>
    </>
  );
};

export default Dashboard;
