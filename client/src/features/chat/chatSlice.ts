import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

export interface messageStructure {
  create_at: any;
  line_text: string;
  user_id: string;
  id: string;
  room_id: string;
}

export interface ChatState {
  messages: Array<messageStructure>;
}

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
