import axios from 'axios';

export const fetchUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3001/user', {
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
    const response = await axios.put('http://localhost:3001/user/profile-image', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'UPDATE_PROFILE_IMAGE', payload: response.data.profileImageUrl });
  } catch (error) {
    console.error('Error updating profile image:', error);
  }
};
