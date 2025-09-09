import React, { useEffect, useState } from 'react';
import "../styles/navbar.css";
import { FaHome, FaBell, FaBookOpen, FaGraduationCap } from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineOndemandVideo, MdAccountCircle, MdSearch } from "react-icons/md";
import axios from 'axios';

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Define API base URL based on environment
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://linkedin-clone-backend-aojx.onrender.com' 
    : 'http://localhost:3001';

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleProfileClick = () => {
    navigate('/dashbord');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Implement search functionality here
      console.log("Search for:", searchTerm);
      setSearchTerm("");
    }
  };

  // Check if current route is active
  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <div className="Topnav education-navbar">
      <div className="nav-left">
        <div className="logo-container">
          <FaGraduationCap className="logo-icon" />
          <span className="logo-text">EduConnect</span>
        </div>
      </div>
      
      <div className="nav-center">
        <div className="search-container">
          <MdSearch className="search-icon" />
          <input 
            className="inputsearch"
            placeholder="Search for courses, people, or resources..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
        </div>
      </div>
      
      <div className="nav-right">
        <NavLink 
          to="/home" 
          className={`nav-item ${isActiveRoute('/home') ? 'active' : ''}`}
        >
          <FaHome className="nav-icon" />
          <span className="nav-label">Home</span>
        </NavLink>
        
        <NavLink 
          to="/chat" 
          className={`nav-item ${isActiveRoute('/chat') ? 'active' : ''}`}
        >
          <AiOutlineMessage className="nav-icon" />
          <span className="nav-label">Messages</span>
        </NavLink>
        
        <NavLink 
          to="/videos" 
          className={`nav-item ${isActiveRoute('/videos') ? 'active' : ''}`}
        >
          <MdOutlineOndemandVideo className="nav-icon" />
          <span className="nav-label">Videos</span>
        </NavLink>
        
        <NavLink 
          to="/notifications" 
          className={`nav-item ${isActiveRoute('/notifications') ? 'active' : ''}`}
        >
          <div className="notification-wrapper">
            <FaBell className="nav-icon" />
            <span className="notification-badge"></span>
          </div>
          <span className="nav-label">Notifications</span>
        </NavLink>
        
        <div 
          className={`nav-item profile-item ${isActiveRoute('/dashbord') ? 'active' : ''}`}
          onClick={handleProfileClick}
        >
          <div className="profile-avatar">
            {currentUser && currentUser.profileImageUrl ? (
              <img 
                className="profile-nav"
                src={`${API_BASE_URL}${currentUser.profileImageUrl}`}
                alt="Profile"
              />
            ) : (
              <MdAccountCircle className="profile-default" />
            )}
          </div>
          <span className="nav-label">Profile</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;