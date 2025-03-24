import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// 从 localStorage 获取初始用户信息
const savedUser = localStorage.getItem('user');
const initialUser = savedUser ? JSON.parse(savedUser) as User : null;
const initialIsAuthenticated = !!initialUser;

const initialState: AuthState = {
  isAuthenticated: initialIsAuthenticated,
  user: initialUser
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // 保存用户信息
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user'); // 清除用户信息
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
