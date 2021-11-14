import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contentChatReducer from 'features/contentChat/contentChatSlice';
import authReducer from 'features/auth/authSlice';
import siderChatReducer from 'features/siderChat/siderChatSlice'
import friendReducer from '../features/addFriendModal/AddFriendSlice'
import headerChatReducer from 'features/headerChat/headerChatSlice'
import accountModalReducer from 'features/accountModal/accountModalSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    contentChat: contentChatReducer,
    friend: friendReducer,
    siderChat: siderChatReducer,
    headerChat: headerChatReducer,
    accountModal: accountModalReducer
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
