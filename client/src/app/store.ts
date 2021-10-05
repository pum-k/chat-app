import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';
import accountReducer from 'components/Common/accountSlice';
export const store = configureStore({
  reducer: {
    account: accountReducer,
    chat: chatReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
