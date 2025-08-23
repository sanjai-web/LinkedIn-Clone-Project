import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import "../styles/login.css";
import logo from "../images/logo.png";
import authImage from "../images/img2.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-navbar">
       <div className="nav-left">
               <div className="logo-container">
                 <FaGraduationCap className="logo-icon" />
                 <span className="logo-text">EduConnect</span>
               </div>
             </div>
      </div>

      <div className="login-content">
        <div className="login-image-section">
         <img src={authImage} alt="Authentication" className="login-image" style={{ height: "500px", width: "auto" }} />

          <div className="login-image-overlay">
            <h2>Welcome Back</h2>
            <p>Connect with professionals and grow your network</p>
          </div>
        </div>

        <div className="login-form-section">
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-form-header">
              <h2>Sign in to your account</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {message && (
              <div className="login-message error">
                {message}
              </div>
            )}

            <div className="form-group-login">
              <label htmlFor="email">Email address</label>
              <div className="input-with-icon-login">
                <MdEmail className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={email ? "has-value" : ""}
                />
              </div>
            </div>

            <div className="form-group-login">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon-login">
                <MdLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={password ? "has-value" : ""}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
              <div className="forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button 
              className={`login-button ${isLoading ? "loading" : ""}`} 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <div className="signup-redirect">
              <p>Don't have an account? <Link to="/signup">Sign up now</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;