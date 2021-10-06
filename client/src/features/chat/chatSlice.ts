import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ChatState, messageStructure } from 'constants/ChatTypes';

const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    joinRoom: (state, action) => {
      action.payload.emit('join_room', {
        room_id: localStorage.getItem('room_id'),
        userInfo: 'thang',
      });
    },
    sendMessage: (state, action) => {
      // if (action.payload.line_text) {
      // }
    },
  },
});

export default chatSlice.reducer;
export const { sendMessage, joinRoom } = chatSlice.actions;
export const selectMessages = (state: RootState) => state.chat.messages;
