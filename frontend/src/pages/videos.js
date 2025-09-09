import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/videos.css";
import { RiVideoAddFill } from "react-icons/ri";
import { MdAccountCircle, MdSearch, MdClose } from "react-icons/md";
import { FiMoreVertical } from "react-icons/fi";
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function Videos() {
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://linkedin-clone-backend-aojx.onrender.com' 
    : 'http://localhost:3001';

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/videos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  
  const closeModal = () => {
    setModalIsOpen(false);
    setVideoTitle('');
    setDescription('');
    setVideoFile(null);
    setThumbnailFile(null);
    setAttachments([]);
    setUploadProgress(0);
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('videoTitle', videoTitle);
    formData.append('description', description);
    formData.append('videoFile', videoFile);
    if (thumbnailFile) {
      formData.append('thumbnailFile', thumbnailFile);
    }
    attachments.forEach(file => formData.append('attachments', file));

    try {
      const response = await axios.post(`${API_BASE_URL}/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      alert('Video uploaded successfully!');
      closeModal();
      fetchVideos();
    } catch (error) {
      console.error('Error uploading video:', error);
      if (error.response) {
        alert(`Failed to upload video: ${error.response.data.message}`);
      } else {
        alert('Failed to upload video.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleThumbnailClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="videos-page">
      <div className='videos-header'>
        <h1 className="videos-title"></h1>
        <div className="search-container">
          <MdSearch className="search-icon" />
          <input
            className="search-videos"
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              <MdClose />
            </button>
          )}
        </div>
        <button className="upload-btn" onClick={openModal}>
          <RiVideoAddFill className="upload-icon" />
          Upload
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Upload Video"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>Upload Video</h2>
          <button onClick={closeModal} className="close-button">
            <MdClose />
          </button>
        </div>
        
        <form onSubmit={handleVideoUpload} className="upload-form">
          <div className="form-group">
            <label htmlFor="videoTitle">Video Title</label>
            <input
              type="text"
              id="videoTitle"
              maxLength="50"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              required
              placeholder="Enter video title"
            />
            <span className="char-count">{videoTitle.length}/50</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              maxLength="1000"
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe your video"
              rows="4"
            ></textarea>
            <span className="char-count">{description.length}/1000</span>
          </div>
          
          <div className="form-group file-group">
            <label htmlFor="videoFile" className="file-label">
              <span>Video File</span>
              <div className="file-input">
                <span>{videoFile ? videoFile.name : 'Choose file'}</span>
                <span className="browse-btn">Browse</span>
              </div>
            </label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
              className="hidden-input"
            />
          </div>
          
          <div className="form-group file-group">
            <label htmlFor="thumbnailFile" className="file-label">
              <span>Thumbnail (Optional)</span>
              <div className="file-input">
                <span>{thumbnailFile ? thumbnailFile.name : 'Choose file'}</span>
                <span className="browse-btn">Browse</span>
              </div>
            </label>
            <input
              type="file"
              id="thumbnailFile"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              className="hidden-input"
            />
          </div>
          
          <div className="form-group file-group">
            <label htmlFor="attachments" className="file-label">
              <span>Attachments (Optional)</span>
              <div className="file-input">
                <span>{attachments.length > 0 ? `${attachments.length} files selected` : 'Choose files'}</span>
                <span className="browse-btn">Browse</span>
              </div>
            </label>
            <input
              type="file"
              id="attachments"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={(e) => setAttachments(Array.from(e.target.files))}
              className="hidden-input"
            />
          </div>
          
          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress}% Uploaded</span>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={closeModal} 
              className="cancel-btn"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="upload-button"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="videos-content">
        {filteredVideos.length > 0 ? (
          <div className="videos-grid">
            {filteredVideos.map(video => (
              <div 
                key={video._id} 
                className="video-card"
                onClick={() => handleThumbnailClick(video._id)}
              >
                <div className="thumbnail-container">
                  {video.thumbnailUrl ? (
                    <img 
                      src={`${API_BASE_URL}${video.thumbnailUrl}`} 
                      alt="Thumbnail" 
                      className="video-thumbnail"
                    />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <RiVideoAddFill />
                    </div>
                  )}
                  <div className="video-duration">10:25</div>
                </div>
                
                <div className="video-info">
                  <div className="video-meta">
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-stats">
                      <span className="views">1.2K views</span>
                      <span className="upload-date">2 days ago</span>
                    </div>
                  </div>
                  
                  <div className="video-creator">
                    {video.user && video.user.profileImageUrl ? (
                      <img 
                        src={`${API_BASE_URL}${video.user.profileImageUrl}`} 
                        alt="Profile" 
                        className="creator-avatar"
                      />
                    ) : (
                      <MdAccountCircle className="creator-avatar" />
                    )}
                    <span className="creator-name">
                      {video.user ? `${video.user.firstName} ${video.user.lastName}` : 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <button className="video-menu-btn">
                  <FiMoreVertical />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <RiVideoAddFill className="empty-icon" />
            <h3>No videos found</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Upload your first video to get started'}</p>
            {!searchTerm && (
              <button className="upload-btn primary" onClick={openModal}>
                Upload Video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Videos;