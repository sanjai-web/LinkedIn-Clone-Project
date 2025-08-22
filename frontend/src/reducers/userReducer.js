const initialState = {
    user: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.payload };
      case 'UPDATE_PROFILE_IMAGE':
        return { ...state, user: { ...state.user, profileImageUrl: action.payload } };
      default:
        return state;
    }
  };
  
  export default userReducer;
  