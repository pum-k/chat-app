import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { friendApi } from 'api/friendAPI';
const initialState = {
  listRequest: [],
};

export const fetchListRequest = createAsyncThunk('friend/list-request', async () => {
  const response: any = await friendApi.listRequest();
  return response.data;
});

export const acceptRequest = createAsyncThunk('friend/accept-request', async (params: string) => {
  const response: any = await friendApi.acceptRequest(params);
  return response.data;
})

export const denyRequest = createAsyncThunk('friend/deny-request', async (params: string) => {
  const response: any = await friendApi.denyRequest(params);
  return response.data;
})

const headerChatSlice = createSlice({
  name: 'headerChatSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListRequest.fulfilled, (state, action) => {
      state.listRequest = action.payload
    });
  },
});


export default headerChatSlice.reducer;
