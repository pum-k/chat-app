import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  onMic: false,
  onCam: false,
  beforeCall: false,
  waitingCall: false,
};

export const phoneCallSlice = createSlice({
  name: 'phone-call',
  initialState,
  reducers: {
    handleMic: (state) => {
      state.onMic = !state.onMic;
    },
    handleCam: (state) => {
      state.onCam = !state.onCam;
    },
  },
});

export default phoneCallSlice.reducer;
export const { handleMic, handleCam } = phoneCallSlice.actions;

