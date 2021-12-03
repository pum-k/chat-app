import { createSlice } from '@reduxjs/toolkit';

const initialState: { onMic: boolean; onCam: boolean} = {
  onMic: true,
  onCam: true,
};

export const inCallSlice = createSlice({
  name: 'in-call',
  initialState,
  reducers: {
    handleOnMic: (state, action) => {
      action.payload.getTracks().forEach(function (track: any) {
        if (track.readyState === 'live' && track.kind === 'audio') {
          try {
            track.enabled = state.onMic;
          } catch (e) {}
        }
      });
    },
    setMic: (state, action) => {
      state.onMic = action.payload;
    },
    setCam: (state, action) => {
      state.onCam = action.payload;
    },
    handleOnCam: (state, action) => {
      action.payload.getTracks().forEach(function (track: any) {
        if (track.readyState === 'live' && track.kind === 'video') {
          try {
            track.enabled = state.onCam;
          } catch (e) {}
        }
      });
    },
  },
});

export default inCallSlice.reducer;
export const { handleOnMic, handleOnCam, setMic, setCam } = inCallSlice.actions;
