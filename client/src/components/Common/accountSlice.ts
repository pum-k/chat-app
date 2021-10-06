import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { accountApi } from 'api/accountApi';
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

const accountLogin = createAsyncThunk('account/login', async (user: LoginInput) => {
  const response = await accountApi.login(user);
  //   return response.data
});

const accountRegister = createAsyncThunk('account/register', async (user: RegisterInput) => {
  const response = await accountApi.register(user);
  //   return response.data
});

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(accountLogin.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(accountLogin.rejected, (state) => {
      state.loadding = false;
      state.error = 'Login Failed!';
    });
    builder.addCase(accountLogin.fulfilled, (state, action) => {
      state.loadding = false;
    });
    builder.addCase(accountRegister.pending, (state) => {
      state.loadding = true;
    });
    builder.addCase(accountRegister.rejected, (state) => {
      state.loadding = false;
      state.error = 'Login Failed!';
    });
    builder.addCase(accountRegister.fulfilled, (state, action) => {
      state.loadding = false;
    });
  },
});