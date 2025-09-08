import axios from 'axios';

export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';

export const fetchPostsSuccess = (posts) => ({
  type: FETCH_POSTS_SUCCESS,
  payload: posts,
});

// Determine API base URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://linkedin-clone-backend-aojx.onrender.com' 
  : 'http://localhost:3001';

export const fetchPosts = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(fetchPostsSuccess(response.data));
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};