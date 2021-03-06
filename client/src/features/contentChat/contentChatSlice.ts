import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { chatApi } from 'api/chatAPI';
import { RootState } from 'app/store';
import { ChatState, messageStructure } from 'constants/ChatTypes';

const initialState: ChatState = {
  messages: [],
  loading: false,
  listRoomChat: [],
  isVisiblePhoneCall: false,
  isVisibleSender: false,
  isVisibleReceiver: false,
};

export const sendMessageAsync = createAsyncThunk(
  'chat/sendMessageAsync',
  async (message: messageStructure) => {
    const response: any = await chatApi.sendMessage(message);
    return response.data;
  }
);
export const renderMessageAsync = createAsyncThunk('chat/renderMessageAsync', async () => {
  const response: any = await chatApi.renderMessage();
  return response.data;
});

export const contentChatSlice = createSlice({
  name: 'contentChatSlice',
  initialState,
  reducers: {
    joinRoom: (state, action) => {
      action.payload.emit('join_room', {
        room_id: localStorage.getItem('room_id'),
        displayName: localStorage.getItem('displayname'),
        userInfo: localStorage.getItem('access_token'),
        peerId: localStorage.getItem('peerid'),
      });
    },
    sendImage: (state, action) => {
      state.messages.push(action.payload);
    },
    handleVisiblePhoneCall: (state, action) => {
      if (!state.isVisiblePhoneCall) state.isVisiblePhoneCall = action.payload;
    },
    handleVisibleSender: (state, action) => {
      if (!state.isVisibleSender) state.isVisibleSender = action.payload;
    },
    handleVisibleReceiver: (state, action) => {
      if (!state.isVisibleReceiver) state.isVisibleReceiver = action.payload;
    },
    setReceiver: (state, action) => {
      state.receiver = action.payload;
    },
    hangUpCall: (state) => {
      state.isVisiblePhoneCall = false;
      state.isVisibleReceiver = false;
      state.isVisibleSender = false;
      state.receiver = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessageAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendMessageAsync.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(sendMessageAsync.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(renderMessageAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(renderMessageAsync.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(renderMessageAsync.fulfilled, (state, action) => {
      if (action.payload.ListMessages) {
        state.messages = action.payload.ListMessages;
      }
      if (action.payload.ListMessages === null) {
        state.messages = [];
      }
    });
  },
});

export default contentChatSlice.reducer;
export const {
  joinRoom,
  sendImage,
  handleVisiblePhoneCall,
  hangUpCall,
  setReceiver,
  handleVisibleSender,
  handleVisibleReceiver,
} = contentChatSlice.actions;
export const selectMessages = (state: RootState) => state.contentChat.messages;
