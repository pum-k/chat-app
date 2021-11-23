import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FriendTypes } from 'constants/FriendTypes';
import { RootState } from 'app/store';
import { friendApi } from 'api/friendAPI';
import { message } from 'antd';

const initialState: FriendTypes = {
  displayName: '',
  phoneNumber: '',
  username: '',
  gender: 'male',
  birthday: '',
  loadding: false,
  isSuccess: false,
  avatar: '',
  cover: '',
};
export const FindFriend = createAsyncThunk('friend/FindFriend', async (number: FriendTypes) => {
  const response: any = await friendApi.findFriend(number);
  return response.data;
});
export const addFriend = createAsyncThunk('friend/addFriend', async (number: FriendTypes) => {
  const response: any = await friendApi.addFriends(number);
  return response.data;
});

export const AddFriendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(FindFriend.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(FindFriend.rejected, (state) => {
      state.loadding = false;
    });
    builder.addCase(FindFriend.fulfilled, (state, action) => {
      state.loadding = false;
      console.log(action.payload);
      if (action.payload.length > 0) {
        console.log(action.payload);
        state.displayName = action.payload[0].displayName || '';
        state.username = action.payload[0].username;
        state.phoneNumber = action.payload[0].phoneNumber;
        state.birthday = action.payload[0].dateOfBirth;
        state.gender = action.payload[0].gender;
        state.avatar = action.payload[0].avatar || '';
        state.cover = action.payload[0].cover_image || '';
      }
    });
    builder.addCase(addFriend.pending, (state) => {
      state.loadding = true;
      message.loading({ content: ' Wait a minute...', key: 'addfriend' });
    });
    builder.addCase(addFriend.rejected, (state) => {
      state.loadding = false;
    });
    builder.addCase(addFriend.fulfilled, (state, action) => {
      state.loadding = false;
      state.isSuccess = action.payload.isSuccess;
      message.success({
        content: 'Friend request sent successfully!',
        key: 'addfriend',
        duration: 2,
      });
    });
  },
});

export default AddFriendSlice.reducer;
export const selectFriend = (state: RootState) => state.friend;
