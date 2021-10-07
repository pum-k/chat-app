import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ChatState, messageStructure } from 'constants/ChatTypes';
import io from 'socket.io-client';
const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<messageStructure>) => {
      if (action.payload.line_text) {
        state.messages.push(action.payload);
      }
    },
  },
});

export default chatSlice.reducer;
export const { sendMessage } = chatSlice.actions;
export const selectMessages = (state: RootState) => state.chat.messages;
