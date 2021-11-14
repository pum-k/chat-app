
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userApi } from 'api/userApi';
import { RootState } from 'app/store';
import { HeaderChatType } from 'constants/HeaderChatTypes';

const initialState: HeaderChatType = {
    loading: false,
    user: {
        user_name: '',
        user_avatar: ''
    }
}

export const fetchUser = createAsyncThunk('header-chat/fetch-user', async () => {
  const response: any = await userApi.getLoggedUser();
  return response.data;
});

export const headerChatSlice = createSlice({
  name: 'headerChat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      if (action.payload) {
        let info = {
          user_name: action.payload[0].username,
          user_avatar: action.payload[0].avatar || null,
        }
        state.user = info;
        state.loading = false;
      }
    });
  },
});

export default headerChatSlice.reducer;
export const selectUser = (state: RootState) => state.headerChat.user;
export const selectHeaderChatLoading = (state: RootState) => state.headerChat.loading;


