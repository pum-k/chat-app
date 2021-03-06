import { RootState } from 'app/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userApi } from 'api/userApi';
import { AccountState, LoginInput, RegisterInput } from 'constants/AccountTypes';

const initialState: AccountState = {
  id: '',
  displayName: '',
  dateOfBirth: null,
  isMale: null,
  loadding: false,
  error: '',
  isSuccess: false,
};

export const authLogin = createAsyncThunk('user/login', async (user: LoginInput) => {
  const response: any = await userApi.login(user);
  return response.data;
});

export const authRegister = createAsyncThunk('user/register', async (user: RegisterInput) => {
  const response: any = await userApi.register(user);
  return response.data;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    removeError: (state) => {
      state.error = '';
    },
    removeIsSuccess: (state) => {
      state.isSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(authLogin.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(authLogin.rejected, (state) => {
      state.loadding = false;
      state.error = 'The connection is not stable. Please try again later!';
    });
    builder.addCase(authLogin.fulfilled, (state, action) => {
      state.loadding = false;
      if (action.payload.error) state.error = action.payload.error;
      if (action.payload.id) {
        state.isSuccess = true;
        localStorage.setItem('access_token', action.payload.id);
        localStorage.setItem('username', action.payload.username);
      }
    });
    builder.addCase(authRegister.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(authRegister.rejected, (state) => {
      state.loadding = false;
      state.error = 'The connection is not stable. Please try again later!';
    });
    builder.addCase(authRegister.fulfilled, (state, action) => {
      state.loadding = false;
      if (action.payload.error) state.error = action.payload.error;

      if (action.payload.isSuccess) {
        state.isSuccess = action.payload.isSuccess;
      }
    });
  },
});

export default authSlice.reducer;
export const { removeError, removeIsSuccess } = authSlice.actions;
export const selectErrorAuth = (state: RootState) => state.auth.error;
export const selectIsSuccess = (state: RootState) => state.auth.isSuccess;
export const selectLoadingAuth = (state: RootState) => state.auth.loadding;
