import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { friendApi } from 'api/friendAPI';
import { fetchListRoom } from 'features/siderChat/siderChatSlice';
const initialState = {
  listPending: [],
  listRequest: [],
  avatar: '',
  cover: '',
};

export const fetchListRequest = createAsyncThunk('friend/list-request', async () => {
  const response: any = await friendApi.listRequest();
  return response.data;
});
export const fetchListPending = createAsyncThunk('friend/list-Pending', async () => {
  const response: any = await friendApi.listPending();
  return response.data;
});

export const acceptRequest = createAsyncThunk(
  'friend/accept-request',
  async (params: string, thunkAPI) => {
    const response: any = await friendApi.acceptRequest(params);
    setTimeout(() => {
      thunkAPI.dispatch(fetchListRoom());
    }, 2000);
    return response.data;
  }
);

export const denyRequest = createAsyncThunk(
  'friend/deny-request',
  async (params: string) => {
    const response: any = await friendApi.denyRequest(params);
    return response.data;
  }
);

const headerChatSlice = createSlice({
  name: 'headerChatSlice',
  initialState,
  reducers: {
    removeRequest: (state, action) => {
      state.listRequest.splice(action.payload, 1);
    },
    uploadAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    uploadCover: (state, action) => {
      state.cover = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListRequest.fulfilled, (state, action) => {
      state.listRequest = action.payload;
    });
    builder.addCase(fetchListPending.fulfilled, (state, action) => {
      state.listPending = action.payload;
    });
    builder.addCase(acceptRequest.fulfilled, (state, action) => {
      if (action.payload.isSuccess) message.success('Add successfully!');
    });
    builder.addCase(denyRequest.fulfilled, (state, action) => {
      if (action.payload.isSuccess) message.success('Deny successfully!');
    });
  },
});

export default headerChatSlice.reducer;
export const { removeRequest, uploadAvatar, uploadCover } = headerChatSlice.actions;
