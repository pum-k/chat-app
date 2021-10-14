import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FriendTypes } from 'constants/FriendTypes';
import { RootState } from 'app/store';
import { friendApi } from 'api/friendAPI';

const initialState: FriendTypes = {
  phoneNumber: '',
  username: '',
  gender: true,
  birthday: '',
  loadding: false,
};
export const FindFriend = createAsyncThunk('friend/FindFriend', async (number: FriendTypes) => {
  const response: any = await friendApi.findFriend(number);
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
      // console.log(action.payload);
      
      state.loadding = true;
      if(action.payload){
        state.username = action.payload[0].username
      }
    
    });
  },
});

export default AddFriendSlice.reducer;
export const selectFriend = (state: RootState) => state.friend;