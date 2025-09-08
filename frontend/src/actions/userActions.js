import axios from 'axios';

// Determine API base URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://linkedin-clone-backend-aojx.onrender.com' 
  : 'http://localhost:3001';

export const fetchUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

export const updateProfileImage = (file) => async (dispatch) => {
  const formData = new FormData();
  formData.append('profileImage', file);

  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/user/profile-image`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    dispatch({ type: 'UPDATE_PROFILE_IMAGE', payload: response.data.profileImageUrl });
  } catch (error) {
    console.error('Error updating profile image:', error);
  }
};