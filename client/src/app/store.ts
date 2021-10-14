import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';
import accountReducer from 'components/Common/accountSlice';
import friendReducer from '../features/addFriendModal/AddFriendSlice'
export const store = configureStore({
  reducer: {
    account: accountReducer,
    chat: chatReducer,
    friend: friendReducer,
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
