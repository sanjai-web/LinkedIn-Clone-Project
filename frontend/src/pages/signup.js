import React, { useState } from 'react';
import axios from 'axios';
import "../styles/navbar.css";
import "../styles/signup.css";
// import logo from "../images/logo.png";
import img from "../images/img3.png";
import { NavLink } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiBook, FiAward } from 'react-icons/fi';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Determine API base URL based on environment
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://linkedin-clone-backend-aojx.onrender.com' 
    : 'http://127.0.0.1:3001';
  
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      firstName,
      lastName,
      email,
      password,
      role
    });
    alert(response.data.message);
    window.location.href = '/'; // Redirect to login page after successful signup
  } catch (error) {
    console.error('Error signing up:', error);
    alert('Failed to sign up');
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="signup-page">
      <div className="Topnav">
       <div className="nav-left">
               <div className="logo-container">
                 <FaGraduationCap className="logo-icon" />
                 <span className="logo-text">EduConnect</span>
               </div>
             </div>
      </div>
      
      <div className="signup-container">
        <div className="signup-form-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Sign up now and get full access to our platform</p>
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <div className="input-icon">
                  <FiUser />
                </div>
                <input
                  placeholder='First Name'
                  className="form-input"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-group">
                <div className="input-icon">
                  <FiUser />
                </div>
                <input
                  placeholder='Last Name'
                  className="form-input"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <div className="input-icon">
                <FiMail />
              </div>
              <input
                placeholder='Email Address'
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                placeholder='Password'
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* </div> */}
            
            <div className="role-selection">
              <p className="role-label">Select your role</p>
              <div className="role-options">
                <div 
                  className={`role-option ${role === 'Teacher' ? 'selected' : ''}`}
                  onClick={() => setRole('Teacher')}
                >
                  <div className="role-icon">
                    <FiBook />
                  </div>
                  <span className="role-text">Teacher</span>
                </div>
                
                <div 
                  className={`role-option ${role === 'Student' ? 'selected' : ''}`}
                  onClick={() => setRole('Student')}
                >
                  <div className="role-icon">
                    <FiAward />
                  </div>
                  <span className="role-text">Student</span>
                </div>
              </div>
            </div>
            
            <button 
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <p className="signin-link">
              Already have an account? <NavLink to="/">Sign in</NavLink>
            </p>
          </form>
        </div>
        
        <div className="signup-image">
          <img src={img} style={{ height: "550px", width: "auto" }} alt="Illustration" />
        </div>
      </div>
    </div>
  );
}