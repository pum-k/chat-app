import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { ChatState, messageStructure , RoomChatStructure } from 'constants/ChatTypes';
import { chatApi } from 'api/chatAPI';

const initialState: ChatState = {
  messages: [],
  ListRoomChat: [],
  loadding: false,
};
export const sendMessageAsync = createAsyncThunk(
  'chat/sendMessageAsync',
  async (message: messageStructure, thunkAPI) => {
    const response: any = await chatApi.sendMessage(message);
    return response.data;
  }
);
export const renderChatListAsync = createAsyncThunk('chat/listRoomChatAsync', async () => {
  const response: any = await chatApi.renderListChat();
  return response.data;
});
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
    builder.addCase(renderChatListAsync.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(renderChatListAsync.rejected, (state) => {
      state.loadding = false;
    });
    builder.addCase(renderChatListAsync.fulfilled, (state, action) => {
      if (action.payload) {
        // action.payload.map((item: any) => {
        //   let RoomChat = {
        //     RoomName: item.name,
        //     RoomSocketId: item.socketRoom,
        //   };
        //   allRoomChat.push(RoomChat);
        // });
        state.ListRoomChat = action.payload
      }
      state.loadding = true;
    });
  },
});

export default chatSlice.reducer;
export const { sendMessage, joinRoom } = chatSlice.actions;
export const selectMessages = (state: RootState) => state.chat;
