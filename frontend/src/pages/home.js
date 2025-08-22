import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MdAccountCircle } from "react-icons/md";
import { fetchPosts } from "../actions/postsActions";
import { FaEllipsisV } from "react-icons/fa";
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

  const handleCreateOrUpdatePost = async (e) => {
    e.preventDefault();
    if (currentPostId) {
      await handleUpdatePost(currentPostId);
    } else {
      await handleCreatePost();
    }
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
      const { description } = response.data;
      setDescription(description);
      setMedia(null);
      setCurrentPostId(postId);
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
      setCurrentPostId(null);
      alert("Post updated successfully");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchPosts());
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again later.");
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
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Adjust 'createdAt' to match your field name

  const toggleMenu = (postId) => {
    setShowMenu(showMenu === postId ? null : postId);
  };

  return (
    <div className="container" style={{ marginTop: 50 }}>
      <div className="upload">
        <span className="up-profile" style={{ color: "#202020" }}>
          {currentUser && currentUser.profileImageUrl ? (
            <img className="profile-home"
              src={`http://localhost:3001${currentUser.profileImageUrl}`}
              alt="Profile"
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
          ) : (
            <MdAccountCircle style={{ width: '50px', height: '50px' }} />
          )}
          <span className="username">
            {currentUser && `${currentUser.firstName} ${currentUser.lastName}`}
          </span>
        </span>
        <form onSubmit={handleCreateOrUpdatePost}>
          <div>
            <textarea
              className="startpost"
              placeholder="Start a Post"
              maxLength="1500"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="media">Media</label>
            <input
              className="choosefile"
              type="file"
              onChange={(e) => setMedia(e.target.files[0])}
            />
            <br />
            <button className="but1" type="submit">
              {currentPostId ? "Update Post" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
      <div className="content">
        <input
          className="searchpost"
          type="text"
          placeholder="Search post by user..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {filteredPosts.map((post) => (
          <div
            className="overcontainer"
            key={post._id}
            style={{ margin: "0px" }}
          >
            <div className="maincontainer">
              {post.user && (
                <>
                  {post.user.profileImageUrl ? (
                    <img
                      src={`http://localhost:3001${post.user.profileImageUrl}`}
                      alt="Profile"
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    />
                  ) : (
                    <MdAccountCircle style={{ width: '50px', height: '50px' }} />
                  )}
                  <p className="name-title">{`${post.user.firstName} ${post.user.lastName}`}</p>
                  <p className="role"><span>Role: </span>{post.user.role}</p>
                  {currentUser && post.user && currentUser._id === post.user._id && (
                    <div className="dropdown-container">
                      <FaEllipsisV
                        className="dropdown-toggle"
                        onClick={() => toggleMenu(post._id)}
                      />
                      {showMenu === post._id && (
                        <div className="dropdown-menu">
                          <div
                            className="dropdown-item"
                            onClick={() => handleEditPost(post._id)}
                          >
                            Edit
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="des">{post.description}</p>
                  {post.mediaUrl &&
                    (post.mediaUrl.endsWith(".mp4") ? (
                      <video width="500" height="350" controls>
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
                        width="500"
                        height="420"
                      />
                    ))}
                </>
              )}
              <br />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
