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
  // console.log(response);
});

export const authRegister = createAsyncThunk('user/register', async (user: RegisterInput) => {
  const response: any = await userApi.register(user);
  return response.data;
  // console.log(response.data);
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    removeError: (state) => {
      state.error = '';
    },
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
        localStorage.setItem('access_token', action.payload.id);
        window.location.href = 'http://localhost:3000/t';
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
      state.isSuccess = action.payload.isSuccess;
      if (action.payload.isSuccess) {
        setTimeout(() => {
          state.isSuccess = false;
          window.location.href = 'http://localhost:3000/login';
        }, 1000);
      }
    });
  },
});

export default authSlice.reducer;
export const { removeError } = authSlice.actions;
export const selectErrorAuth = (state: RootState) => state.auth.error;
export const selectIsSuccess = (state: RootState) => state.auth.isSuccess;
export const selectLoadingAuth = (state: RootState) => state.auth.loadding;
