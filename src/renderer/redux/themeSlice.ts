import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 从 localStorage 获取初始主题
const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
const initialTheme = savedTheme || 'light';

interface ThemeState {
  theme: 'light' | 'dark';
}

const initialState: ThemeState = {
  theme: initialTheme // 使用保存的主题或默认值
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload); // 保存到 localStorage
    }
  }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
