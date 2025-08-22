import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../styles/videoplayer.css";
import { MdAccountCircle } from "react-icons/md";
import { MdCloudDownload } from "react-icons/md";
function VideoPlayer() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    console.log("Video ID:", videoId); // Log to verify it's being passed correctly
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/videos/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setVideo(response.data);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
  
    fetchVideo();
  }, [videoId]);
  
  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='vidplaycontainer'>
        <video controls width="1080" height="720">
          <source src={`http://localhost:3001${video.videoUrl}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <h1 className='vidtitle'>{video.title}</h1>
        
        <div className='maindet'>
          <div className='vidpro'>
            {video.user && video.user.profileImageUrl ? (
              <img 
                src={`http://localhost:3001${video.user.profileImageUrl}`} 
                alt="Profile" 
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
            ) : (
              <MdAccountCircle style={{ width: '40px', height: '40px' }} />
            )}
            <p className='vidname'>{video.user ? `${video.user.firstName} ${video.user.lastName}` : 'Unknown'}</p>
          </div>
        </div>
        <div className='contvid'>
        {video.attachments && video.attachments.length > 0 && (
  <div>

    <h3>Notes:</h3>
    <ul>
      {video.attachments.map((attachment, index) => (
        <p key={index}>
          <a href={`http://localhost:3001${attachment}`} download>
            <button className="download-button">
            <MdCloudDownload className='downic' /> Notes {index + 1}
            </button>
          </a>
        </p>
      ))}
    </ul>
  </div>
)}
<br></br>
<h3>Description:</h3>
        <p>{video.description}</p>
        
        </div>
      </div>
    </>
  );
}

export default VideoPlayer;
