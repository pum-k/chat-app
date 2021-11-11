import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contentChatReducer from 'features/contentChat/contentChatSlice';
import accountReducer from 'components/Common/accountSlice';
import friendReducer from '../features/addFriendModal/AddFriendSlice'
export const store = configureStore({
  reducer: {
    account: accountReducer,
    contentChat: contentChatReducer,
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
