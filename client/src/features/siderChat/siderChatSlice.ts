import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { roomApi } from 'api/siderChatApi';
import { RootState } from 'app/store';
import { ListRoomChat } from 'constants/SiderChatTypes';

const initialState: ListRoomChat = {
  loading: false,
  data: [],
};

export const fetchListRoom = createAsyncThunk('sider-chat/fetchListRoom', async () => {
  const response: any = await roomApi.fetchList();
  return response.data;
});

export const siderChatSlice = createSlice({
  name: 'siderChat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListRoom.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchListRoom.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchListRoom.fulfilled, (state, action) => {
      if (action.payload.infoAllRoomChat) {
        state.data = action.payload.infoAllRoomChat;
        state.loading = false;
      }
    });
  },
});

export default siderChatSlice.reducer;
export const selectListRoom = (state: RootState) => state.siderChat.data;
export const selectListRoomLoading = (state: RootState) => state.siderChat.loading;
