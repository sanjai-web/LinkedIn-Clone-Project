import { FETCH_POSTS_SUCCESS } from '../actions/postsActions';

const initialState = {
  posts: [],  // Initialize posts as an empty array
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.payload,
      };
    default:
      return state;
  }
};

export default postsReducer;
