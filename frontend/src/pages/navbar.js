import React, { useEffect, useState } from 'react';
import "../styles/navbar.css";
import logo from "../images/On.png";
import { FaHome, FaBell } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineOndemandVideo, MdAccountCircle } from "react-icons/md";
import axios from 'axios';

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      alert("Failed to fetch current user");
    }
  };

  const handleProfileClick = () => {
    navigate('/dashbord');
  };

  return (
    <div className="Topnav">
      <img src={logo} alt="Company Logo" className='logo' style={{ maxWidth: '35px', maxHeight: '35px' }} />
      <input className="inputsearch" placeholder="Search"  />
      <div className='icons1'>
        <span className="homei">
          <NavLink to="/home">
            <FaHome fontSize="28px" />
          </NavLink>
        </span>
        <span className='message'>
          <NavLink to="/chat">
            <AiOutlineMessage fontSize="28px" />
          </NavLink>
        </span>
        <span className='noti'>
          <NavLink to="/notifications">
            <FaBell fontSize="28px" />
          </NavLink>
        </span>
        <span className='vid'>
          <NavLink to="/videos">
            <MdOutlineOndemandVideo fontSize="28px" />
          </NavLink>
        </span>
        <span className='prof' style={{ color: "#00000099", cursor: "pointer" }} onClick={handleProfileClick}>
          {currentUser && currentUser.profileImageUrl ? (
            <img className="profile-nav"
              src={`http://localhost:3001${currentUser.profileImageUrl}`}
              alt="Profile"
              style={{ width: '33px', height: '33px', borderRadius: '50%'  }}
            />
          ) : (
            <MdAccountCircle style={{ width: '33px', height: '33px' }} />
          )}
        </span>
      </div>
    </div>
  );
}

export default Navbar;
