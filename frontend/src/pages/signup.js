import React, { useState } from 'react';
import axios from 'axios';
import "../styles/navbar.css";
import "../styles/signup.css";
import logo from "../images/logo.png";
import img from "../images/img3.png";
import { NavLink } from "react-router-dom";
export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3001/signup', {
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
    }
  };

  return (
    <div >
       <div className="Topnav">
     <img src={logo} alt="Company Logo" className='logo' style={{ maxWidth: '35px', maxHeight: '35px', left: '40%' } } />
  <input className="input1" placeholder="Search" style={{ left: '45%' }} />
  
  <form className="form6" onSubmit={handleSubmit}>
      
   <h3 className="title6" >Signup</h3>
   <p class="message6">Signup now and get full access to our app. </p>
     <div className="flex6">
          
          <input
          placeholder='First Name'
          className="input-container"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          /><br />
        </div>
        <div>
          
          <input
          placeholder='Last Name'
          className="input-container"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          /><br />
        </div>
        <div>
          
          <input
          placeholder='Email'
          className="input-container"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
        </div>
        <div>
          
          <input
          placeholder='Password'
          className="input-container"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
        </div>
        <div className='role'>
          <label>Role</label>
          <label className="radio-button">
           
          <input
            type="radio"
            value="Teacher"
            checked={role === 'Teacher'}
            onChange={() => setRole('Teacher')}
          /> 
           <span className="radio"></span>
          <span className='teacher'>
          Teacher
          </span>
          </label>
         
          <label className="radio-button">
          <input
          className='size'
            type="radio"
            value="Student"
            checked={role === 'Student'}
            onChange={() => setRole('Student')}
            
          /> 
          <span className="radio"></span>
          <span className='student'>
          Student
          </span>
</label>

        </div>
        <button className="submit6" type="submit">Signup</button>
        <p className="signin">Already have an acount ? <NavLink to="/">
            Signin
          </NavLink> </p>
      </form>
      <img src={img} alt="Company Logo" className="logo3" style={{ maxWidth: '650px', maxHeight: '650px' }} />
    </div></div>
  );
}
