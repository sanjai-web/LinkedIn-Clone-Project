import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MdAccountCircle, MdPhotoLibrary, MdVideocam, MdMoreVert } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import { fetchPosts } from "../actions/postsActions";
import "../styles/home.css";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const currentUser = useSelector((state) => state.user.user);
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts());
    fetchCurrentUser();
  }, [dispatch]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get("http://localhost:3001/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      alert("Failed to fetch current user");
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  };

  const handleCreateOrUpdatePost = async (e) => {
    e.preventDefault();
    if (currentPostId) {
      await handleUpdatePost(currentPostId);
    } else {
      await handleCreatePost();
    }
    setMediaPreview(null);
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("description", description);
    if (media) {
      formData.append("media", media);
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetchPosts());
      setDescription("");
      setMedia(null);
      setMediaPreview(null);
      alert("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  const handleEditPost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3001/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { description, mediaUrl } = response.data;
      setDescription(description);
      setMedia(null);
      setMediaPreview(mediaUrl ? `http://localhost:3001${mediaUrl}` : null);
      setCurrentPostId(postId);
      setShowMenu(null);
    } catch (error) {
      console.error("Error editing post:", error);
      alert("Failed to edit post");
    }
  };

  const handleUpdatePost = async (postId) => {
    const formData = new FormData();
    formData.append("description", description);
    if (media) {
      formData.append("media", media);
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3001/posts/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetchPosts());
      setDescription("");
      setMedia(null);
      setMediaPreview(null);
      setCurrentPostId(null);
      alert("Post updated successfully");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchPosts());
        setShowMenu(null);
        console.log("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again later.");
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = posts
    .filter((post) => {
      if (post.user) {
        const fullName = `${post.user.firstName} ${post.user.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      }
      return false;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const toggleMenu = (postId) => {
    setShowMenu(showMenu === postId ? null : postId);
  };

  const cancelEdit = () => {
    setDescription("");
    setMedia(null);
    setMediaPreview(null);
    setCurrentPostId(null);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="create-post-card">
          <div className="post-header">
            {currentUser && currentUser.profileImageUrl ? (
              <img 
                className="profile-image"
                src={`http://localhost:3001${currentUser.profileImageUrl}`}
                alt="Profile"
              />
            ) : (
              <MdAccountCircle className="profile-icon" />
            )}
            <div className="user-info">
              <span className="username">
                {currentUser && `${currentUser.firstName} ${currentUser.lastName}`}
              </span>
              <span className="post-privacy">Public</span>
            </div>
          </div>
          
          <form onSubmit={handleCreateOrUpdatePost} className="post-form">
            <textarea
              className="post-textarea"
              placeholder="What's on your mind?"
              maxLength="1500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            {mediaPreview && (
              <div className="media-preview">
                {mediaPreview.includes('.mp4') ? (
                  <video controls>
                    <source src={mediaPreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={mediaPreview} alt="Media preview" />
                )}
                <button 
                  type="button" 
                  className="remove-media-btn"
                  onClick={() => {
                    setMedia(null);
                    setMediaPreview(null);
                  }}
                >
                  ×
                </button>
              </div>
            )}
            
            <div className="post-actions">
              <div className="media-buttons">
                <label className="media-btn">
                  <MdPhotoLibrary />
                  Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaChange}
                    hidden
                  />
                </label>
                <label className="media-btn">
                  <MdVideocam />
                  Video
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleMediaChange}
                    hidden
                  />
                </label>
              </div>
              
              <div className="submit-buttons">
                {currentPostId && (
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  className="submit-post-btn" 
                  type="submit"
                  disabled={!description.trim() && !media}
                >
                  <RiSendPlaneFill />
                  {currentPostId ? "Update" : "Post"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search posts by user..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            {searchTerm ? `No posts found for "${searchTerm}"` : "No posts available"}
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div className="post-card" key={post._id}>
              <div className="post-header">
                <div className="user-details">
                  {post.user && post.user.profileImageUrl ? (
                    <img
                      className="profile-image"
                      src={`http://localhost:3001${post.user.profileImageUrl}`}
                      alt="Profile"
                    />
                  ) : (
                    <MdAccountCircle className="profile-icon" />
                  )}
                  <div className="user-info">
                    <span className="username">{`${post.user.firstName} ${post.user.lastName}`}</span>
                    <span className="user-role">{post.user.role}</span>
                    <span className="post-time">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {currentUser && post.user && currentUser._id === post.user._id && (
                  <div className="post-menu">
                    <button 
                      className="menu-toggle"
                      onClick={() => toggleMenu(post._id)}
                    >
                      <MdMoreVert />
                    </button>
                    {showMenu === post._id && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => handleEditPost(post._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="dropdown-item delete"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="post-content">
                <p className="post-description">{post.description}</p>
                
                {post.mediaUrl && (
                  <div className="post-media">
                    {post.mediaUrl.endsWith(".mp4") ? (
                      <video controls>
                        <source
                          src={`http://localhost:3001${post.mediaUrl}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={`http://localhost:3001${post.mediaUrl}`}
                        alt="Post media"
                      />
                    )}
                  </div>
                )}
              </div>
              
              <div className="post-engagement">
                <button className="engagement-btn">Like</button>
                <button className="engagement-btn">Comment</button>
                <button className="engagement-btn">Share</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}