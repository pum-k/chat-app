import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { userApi } from 'api/userApi';
import { RootState } from 'app/store';
import { AccountModal } from 'constants/accountModalTypes';
import { updateUserType } from 'constants/accountModalTypes';

const initialState: AccountModal = {
  loading: false,
  user: {
    user_cover_image: '',
    user_avatar: '',
    user_display_name: '',
    user_name: '',
    user_phone_number: '',
    user_birthday: '',
    user_gender: 'male',
  },
};

export const fetchUserModal = createAsyncThunk('account-modal/fetch-user', async () => {
  const response: any = await userApi.getLoggedUser();
  return response.data;
});

export const updateUserModal = createAsyncThunk(
  'account-modal/update-user',
  async (params: updateUserType) => {
    const response: any = await userApi.updateUser(params);
    return response.data;
  }
);

export const accountModalSlice = createSlice({
  name: 'accountModal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserModal.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserModal.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchUserModal.fulfilled, (state, action) => {
      if (action.payload) {
        localStorage.setItem('displayname', action.payload[0].displayName)
        let user = {
          user_cover_image: action.payload[0].cover_image || '',
          user_avatar: action.payload[0].avatar || '',
          user_display_name: action.payload[0].displayName || '',
          user_name: action.payload[0].username || '',
          user_phone_number: action.payload[0].phoneNumber || '',
          user_birthday: action.payload[0].dateOfBirth || '',
          user_gender: action.payload[0].gender || 'male',
        };
        state.user = user;        
        state.loading = false;
      }
    });
    builder.addCase(updateUserModal.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserModal.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(updateUserModal.fulfilled, (state, action) => {
      if (action.payload) {
        message.success('Update infomation successfully!')
        let user = {
          user_cover_image: action.payload.data.cover_image || state.user.user_cover_image,
          user_avatar: action.payload.data.user_avatar || state.user.user_avatar,
          user_display_name: action.payload.data.displayName || state.user.user_display_name,
          user_name: action.payload.data.username || state.user.user_name,
          user_phone_number: action.payload.data.phoneNumber || state.user.user_phone_number,
          user_birthday: action.payload.data.dateOfBirth || state.user.user_birthday,
          user_gender: action.payload.data.gender || state.user.user_gender,
        };
        state.user = user;
        state.loading = false;        
      }
    });
  },
});

export default accountModalSlice.reducer;
export const selectUserModal = (state: RootState) => state.accountModal.user;
export const selectUserUpdate = (state: RootState) => state.accountModal.loading;
