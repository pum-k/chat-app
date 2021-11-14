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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authLogin.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(authLogin.rejected, (state) => {
      state.loadding = false;
      state.error = 'Login Failed!';
    });
    builder.addCase(authLogin.fulfilled, (state, action) => {
      state.loadding = false;
      // console.log(action.payload);
      if (action.payload.id) {
        localStorage.setItem('access_token', action.payload.id);
        window.location.href = 'http://localhost:3000';
      }
    });
    builder.addCase(authRegister.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(authRegister.rejected, (state) => {
      state.loadding = false;
      state.error = 'Login Failed!';
    });
    builder.addCase(authRegister.fulfilled, (state, action) => {
      state.loadding = false;
      state.isSuccess = action.payload.isSuccess;
      if (action.payload.isSuccess) {
        window.location.href = 'http://localhost:3000/login';
      }

      // console.log(action.payload);
    });
  },
});

export default authSlice.reducer;
