import { createSlice } from '@reduxjs/toolkit';
import { TimerState } from '@/types';

const initialState: TimerState = {
  value: 0,
  isRunning: false,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    start: (state) => {
      state.isRunning = true;
    },
    stop: (state) => {
      state.isRunning = false;
    },
    reset: (state) => {
      state.isRunning = false;
      state.value = 0
    }
  },
});

// Exporta los action creators y el reducer
export const { increment, start, reset, stop } = timerSlice.actions;

export default timerSlice.reducer;
