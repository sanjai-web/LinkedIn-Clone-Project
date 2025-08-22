import axios from 'axios';

export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';

export const fetchPostsSuccess = (posts) => ({
  type: FETCH_POSTS_SUCCESS,
  payload: posts,
});

export const fetchPosts = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3001/posts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(fetchPostsSuccess(response.data));
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};
