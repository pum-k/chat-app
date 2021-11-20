import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
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
  reducers: {
    removeRequest: (state, action) => {
      state.listRequest.splice(action.payload, 1);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListRequest.fulfilled, (state, action) => {
      console.log(action.payload)
      state.listRequest = action.payload
    });
    builder.addCase(acceptRequest.fulfilled, (state, action) => {
      if(action.payload.isSuccess) message.success("Add successfully!");
    })
    builder.addCase(denyRequest.fulfilled, (state, action) => {
      if(action.payload.isSuccess) message.success("Deny successfully!");
    })
  },
});


export default headerChatSlice.reducer;
export const {removeRequest} = headerChatSlice.actions;
