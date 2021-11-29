import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import { message } from 'antd';
import { roomApi } from 'api/siderChatApi';
import { userApi } from 'api/userApi';
import { RootState } from 'app/store';
import { ListRoomChat } from 'constants/SiderChatTypes';

const initialState: ListRoomChat = {
  loading: false,
  data: [],
};

export const fetchListRoom = createAsyncThunk('sider-chat/fetchListRoom', async () => {
  const response: any = await roomApi.fetchList();
  return response.data;
});
export const blockUserAsync = createAsyncThunk(
  'user/block-user',
  async (params: { owners: string | null; room_id: string }, param) => {
    param.dispatch(updateBlock(params.room_id));
    const response: any = await userApi.blockUser(params);
    return response.data;
  }
);
export const unBlockUserAsync = createAsyncThunk(
  'user/un-block-user',
  async (params: { owners: string | null; room_id: string }, param) => {
    const response: any = await userApi.unBlockUser(params);
    return response.data;
  }
);

export const unFriendAsync = createAsyncThunk(
  'user/un-friend-user',
  async (params: { owners: string | null; nameUnfriend: string }, thunkAPI) => {
    const response: any = await userApi.unFriend(params);
    setTimeout(() => {
      thunkAPI.dispatch(fetchListRoom());
    }, 1000)
    return response.data;
  }
);

export const siderChatSlice = createSlice({
  name: 'siderChat',
  initialState,
  reducers: {
    updateBlock: (state, action) => {
      const temp = current(state.data).findIndex((item) => item.room_id === action.payload);
      state.data[temp].isBlock = !state.data[temp].isBlock;
    },
    increaseNumberNotSeen: (state, action) => {
      const temp = current(state.data).findIndex((item) => item.room_id === action.payload.Room);
      if (state.data[temp].numberNotSeen !== undefined) {
        state.data[temp].numberNotSeen = state.data[temp].numberNotSeen + 1;
      } else {
        state.data[temp].numberNotSeen = 1;
      }
    },
    removeNotSeen: (state, action) => {
      const temp = current(state.data).findIndex((item) => item.room_id === action.payload);
      if (state.data[temp] !== undefined) state.data[temp].numberNotSeen = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListRoom.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchListRoom.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchListRoom.fulfilled, (state, action) => {
      if (action.payload.infoAllRoomChat) {
        state.data = action.payload.infoAllRoomChat;
        state.loading = false;
      }
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
        }, 500);
      }
    });
    builder.addCase(unBlockUserAsync.pending, (state) => {
      message.loading('Wait a second...', 0.5);
    });
    builder.addCase(unBlockUserAsync.fulfilled, (state, action) => {
      if (action.payload.isSuccess) {
        const temp = current(state.data).findIndex((item) => item.room_id === action.payload.roomId);
        state.data[temp].isBlock = !state.data[temp].isBlock;
        setTimeout(() => {
          message.success('Unblock user successfully!');
        }, 500);
      } else {
        setTimeout(() => {
          message.error('You can not do this!');
        }, 500);
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
      if (action.payload.isSuccess) {
        setTimeout(() => {
          message.success('Unfriend successfully!');
        }, 500);
      }
    });
  },
});

export default siderChatSlice.reducer;
export const { updateBlock, increaseNumberNotSeen, removeNotSeen } = siderChatSlice.actions;
export const selectListRoom = (state: RootState) => state.siderChat.data;
export const selectListRoomLoading = (state: RootState) => state.siderChat.loading;
