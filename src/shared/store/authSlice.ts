import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@apps/auth/services/types';
import { tokenManager } from '@/shared/utils/tokenManager';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!tokenManager.getAccessToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser; accessToken: string }>) => {
      tokenManager.setAccessToken(action.payload.accessToken);
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      tokenManager.clearAccessToken();
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
