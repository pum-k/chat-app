import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ChatState, messageStructure } from 'constants/ChatTypes';
import { chatApi } from 'api/chatAPI';

const initialState: ChatState = {
  messages: [],
  loadding: false,
};
export const sendMessageAsync = createAsyncThunk(
  'chat/sendMessageAsync',
  async (message: messageStructure, thunkAPI) => {
    const response: any = await chatApi.sendMessage(message);
    return response.data;
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    joinRoom: (state, action) => {
      action.payload.emit('join_room', {
        room_id: localStorage.getItem('room_id'),
        userInfo: localStorage.getItem('access_token'),
      });
    },

    sendMessage: (state, action) => {
      if (action.payload.line_text) {
        state.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessageAsync.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(sendMessageAsync.rejected, (state) => {
      state.loadding = false;
    });
    builder.addCase(sendMessageAsync.fulfilled, (state, action) => {
      state.loadding = false;
    });
  },
});

export default chatSlice.reducer;
export const { sendMessage, joinRoom } = chatSlice.actions;
export const selectMessages = (state: RootState) => state.chat.messages;
