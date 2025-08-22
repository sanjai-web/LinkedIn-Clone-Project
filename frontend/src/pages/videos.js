import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/videos.css";
import { RiVideoAddFill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function Videos() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/videos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data); // Log to check if user data is coming correctly
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('videoTitle', videoTitle);
    formData.append('description', description);
    formData.append('videoFile', videoFile);
    if (thumbnailFile) {
      formData.append('thumbnailFile', thumbnailFile);
    }
    attachments.forEach(file => formData.append('attachments', file));
  
    try {
      const response = await axios.post('http://localhost:3001/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    }
  };

  const handleThumbnailClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='top-content'>
        <input
          className="searchvideos"
          type="text"
          placeholder="Search Videos by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span>
          <RiVideoAddFill fontSize="35px" className='add-videos' onClick={openModal} />
        </span>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Upload Video"
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeModal} className="close-button">&times;</button>
        <h2>Upload Video</h2>
        <form onSubmit={handleVideoUpload}>
          <div className="form-group">
            <label htmlFor="videoTitle">Video Title:</label>
            <input
              type="text"
              id="videoTitle"
              maxLength="50"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              maxLength="1000"
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="videoFile">Video File:</label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="thumbnailFile">Thumbnail:</label>
            <input
              type="file"
              id="thumbnailFile"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
            />
          </div>
          <div className="form-group">
            <label htmlFor="attachments">Attachments (PDF/Word/Images):</label>
            <input
              type="file"
              id="attachments"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              onChange={(e) => setAttachments(Array.from(e.target.files))}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="upload-button">Upload</button>
          </div>
        </form>
      </Modal>

      <div className="videos-list">
        {filteredVideos.map(video => (
          <div 
            key={video._id} 
            className="video-item" 
            onClick={() => handleThumbnailClick(video._id)}
            style={{ cursor: 'pointer' }}
          >
            {video.thumbnailUrl && <img src={`http://localhost:3001${video.thumbnailUrl}`} alt="Thumbnail" />}
            <h3>{video.title}</h3>
            {/* <div className="video-info">
              {video.user && video.user.profileImageUrl ? (
                <img 
                  src={`http://localhost:3001${video.user.profileImageUrl}`} 
                  alt="Profile" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              ) : (
                <MdAccountCircle style={{ width: '40px', height: '40px' }} />
              )}
              <p>{video.user ? `${video.user.firstName} ${video.user.lastName}` : 'Unknown'}</p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Videos;
