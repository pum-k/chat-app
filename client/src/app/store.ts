import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contentChatReducer from 'features/contentChat/contentChatSlice';
import authReducer from 'features/auth/authSlice';
import siderChatReducer from 'features/siderChat/siderChatSlice'
import friendReducer from '../features/addFriendModal/AddFriendSlice'
import accountModalReducer from 'features/accountModal/accountModalSlice'
import headerChatReducer from 'features/headerChat/headerChatSlice'
import inCallReducer from 'features/InCall/inCallSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    contentChat: contentChatReducer,
    friend: friendReducer,
    siderChat: siderChatReducer,
    accountModal: accountModalReducer,
    headerChat: headerChatReducer,
    inCall: inCallReducer,
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
