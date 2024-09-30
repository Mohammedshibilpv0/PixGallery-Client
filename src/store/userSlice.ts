import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  userInfo: { _id:string,name: string, email: string,phone:string } | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reduxLogin: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    reduxLogout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
    }
  },
});

export const { reduxLogin, reduxLogout } = userSlice.actions;
export default userSlice.reducer;
