import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { RootState } from 'app/store';
import { ChatState, messageStructure } from 'constants/ChatTypes';
import io from 'socket.io-client';
import { chatApi } from 'api/chatAPI';
const initialState: ChatState = {
  messages: [],
  loadding: false,
};
export const sendMessages = createAsyncThunk(
  'chat/sendMessages',
  async (message: messageStructure) => {
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
    newMessage: (state, action) => {
      action.payload.on('newMessages', (message: any) => {
        state.messages.push(message);
        // setMessage([...messages, message]);
      });
    },
    sendMessage: (state, action) => {
      // if (action.payload.line_text) {
      // }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessages.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(sendMessages.rejected, (state) => {
      state.loadding = false;
    });
    builder.addCase(sendMessages.fulfilled, (state, action) => {
      console.log(action.payload);
    });
  },
});

export default chatSlice.reducer;
export const { sendMessage, joinRoom } = chatSlice.actions;
export const selectMessages = (state: RootState) => state.chat.messages;
