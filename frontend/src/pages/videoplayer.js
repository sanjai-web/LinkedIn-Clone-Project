import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../styles/videoplayer.css";
import { MdAccountCircle, MdCloudDownload, MdThumbUp, MdThumbDown, MdPlaylistAdd, MdShare } from "react-icons/md";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

function VideoPlayer() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  // Define API base URL based on environment
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://linkedin-clone-backend-aojx.onrender.com' 
    : 'http://localhost:3001';

  useEffect(() => {
    console.log("Video ID:", videoId);
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setVideo(response.data);
        // Set mock data for demonstration
        setLikeCount(Math.floor(Math.random() * 100) + 50);
        setViewCount(Math.floor(Math.random() * 1000) + 500);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
  
    fetchVideo();
  }, [videoId, API_BASE_URL]);
  
  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      if (isDisliked) {
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      }
    }
  };

  if (!video) {
    return (
      <div className="vidplaycontainer">
        <div className="video-skeleton">
          <div className="skeleton-video-player"></div>
          <div className="skeleton-details">
            <div className="skeleton-title"></div>
            <div className="skeleton-metadata">
              <div className="skeleton-views"></div>
              <div className="skeleton-actions"></div>
            </div>
            <div className="skeleton-channel">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-channel-info">
                <div className="skeleton-channel-name"></div>
                <div className="skeleton-subscribers"></div>
              </div>
            </div>
            <div className="skeleton-description"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='vidplaycontainer'>
        <div className="video-wrapper">
          <video controls width="100%">
            <source src={`${API_BASE_URL}${video.videoUrl}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="video-info">
          <h1 className='vidtitle'>{video.title}</h1>
          
          <div className="video-metadata">
            <div className="view-count">{viewCount.toLocaleString()} views</div>
            <div className="video-actions">
              <button 
                className={`action-btn ${isLiked ? 'active' : ''}`}
                onClick={handleLike}
              >
                {isLiked ? <BiSolidLike /> : <MdThumbUp />}
                <span>{likeCount.toLocaleString()}</span>
              </button>
              <button 
                className={`action-btn ${isDisliked ? 'active' : ''}`}
                onClick={handleDislike}
              >
                {isDisliked ? <BiSolidDislike /> : <MdThumbDown />}
              </button>
              <button className="action-btn">
                <MdShare />
                <span>Share</span>
              </button>
              <button className="action-btn">
                <MdPlaylistAdd />
                <span>Save</span>
              </button>
            </div>
          </div>
          
          <div className='channel-info'>
            <div className='channel-details'>
              <div className='channel-avatar'>
                {video.user && video.user.profileImageUrl ? (
                  <img 
                    src={`${API_BASE_URL}${video.user.profileImageUrl}`} 
                    alt="Profile" 
                  />
                ) : (
                  <MdAccountCircle />
                )}
              </div>
              <div className="channel-text">
                <p className='channel-name'>{video.user ? `${video.user.firstName} ${video.user.lastName}` : 'Unknown'}</p>
                <p className="subscriber-count">1.2K subscribers</p>
              </div>
            </div>
            <button className="subscribe-btn">Subscribe</button>
          </div>
          
          <div className='video-description'>
            <h3>Description</h3>
            <p>{video.description}</p>
          </div>
          
          {video.attachments && video.attachments.length > 0 && (
            <div className="attachments-section">
              <h3>Notes & Resources</h3>
              <div className="attachments-grid">
                {video.attachments.map((attachment, index) => (
                  <a 
                    key={index} 
                    href={`${API_BASE_URL}${attachment}`} 
                    download
                    className="attachment-card"
                  >
                    <div className="attachment-icon">
                      <MdCloudDownload />
                    </div>
                    <div className="attachment-info">
                      <h4>Notes {index + 1}</h4>
                      <p>PDF Document</p>
                    </div>
                    <div className="download-btn">
                      <MdCloudDownload />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VideoPlayer;