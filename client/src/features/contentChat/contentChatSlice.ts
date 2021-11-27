import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { chatApi } from 'api/chatAPI';
import { userApi } from 'api/userApi';
import { RootState } from 'app/store';
import { ChatState, messageStructure } from 'constants/ChatTypes';
import { setTimeout } from 'timers';

const initialState: ChatState = {
  messages: [],
  loading: false,
  listRoomChat: [],
  isBlock: false,
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

export const blockUserAsync = createAsyncThunk(
  'user/block-user',
  async (params: { owners: string | null; room_id: string }) => {
    const response: any = await userApi.blockUser(params);
    return response.data;
  }
);
export const unBlockUserAsync = createAsyncThunk(
  'user/un-block-user',
  async (params: { owners: string | null; room_id: string }) => {
    const response: any = await userApi.unBlockUser(params);
    return response.data;
  }
);
export const unFriendAsync = createAsyncThunk(
  'user/un-friend-user',
  async (params: { owners: string | null; nameUnfriend: string }) => {
    const response: any = await userApi.unFriend(params);
    return response.data;
  }
);

export const contentChatSlice = createSlice({
  name: 'contentChatSlice',
  initialState,
  reducers: {
    joinRoom: (state, action) => {
      action.payload.emit('join_room', {
        room_id: localStorage.getItem('room_id'),
        userInfo: localStorage.getItem('access_token'),
      });
    },
    sendImage: (state, action) => {
      state.messages.push(action.payload);
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

      state.isBlock = action.payload.isBlock;
    });
    builder.addCase(blockUserAsync.pending, (state) => {
      state.loading = true;
      message.loading('Wait a second...', 0.5);
    });
    builder.addCase(blockUserAsync.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(blockUserAsync.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.isSuccess) {
        setTimeout(() => {
          message.success('Block user successfully!');
          state.isBlock = true;
        }, 500);
      } else {
        message.error('You are not authorized to do this!');
      }
    });
    builder.addCase(unBlockUserAsync.pending, (state) => {
      state.loading = true;
      message.loading('Wait a second...', 0.5);
    });
    builder.addCase(unBlockUserAsync.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(unBlockUserAsync.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.isSuccess) {
        setTimeout(() => {
          state.isBlock = false;
          message.success('Unblock user successfully!');
        }, 500);
      } else {
        message.error('You are not authorized to do this!');
      }
    });
    builder.addCase(unFriendAsync.pending, (state) => {
      state.loading = true;
      message.loading('Wait a second...', 0.5);

    });
    builder.addCase(unFriendAsync.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(unFriendAsync.fulfilled, (state, action) => {
      if(action.payload.isSuccess){
        setTimeout(() => {
          message.success('Unfriend successfully!');
          window.location.reload();
        }, 500)
      }
    });
  },
});

export default contentChatSlice.reducer;
export const { joinRoom, sendImage } = contentChatSlice.actions;
export const selectMessages = (state: RootState) => state.contentChat.messages;
