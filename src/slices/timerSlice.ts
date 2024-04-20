import { createSlice } from '@reduxjs/toolkit';
import { TimerState } from '@/types';
import moment from 'moment'

const defaultInitialState: TimerState = {
  value: 0,
  isRunning: false,
};

const getInitialState = (): TimerState => {
  const auxInitialState: string|null = window.localStorage.getItem('timer')
  if(!auxInitialState){
    return defaultInitialState
  }

  const auxInitialStateData = JSON.parse(auxInitialState)
  const timerInit = moment(auxInitialStateData.startMoment)
  const actualMoment = moment();

  const segundosTranscurridos = actualMoment.diff(timerInit, 'seconds');

  return {
    value: segundosTranscurridos,
    isRunning: true,
  }

}

export const timerSlice = createSlice({
  name: 'timer',
  initialState: getInitialState(),
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    start: (state) => {
      state.isRunning = true;
      window.localStorage.setItem('timer', JSON.stringify({startMoment: new Date()}))
    },
    stop: (state) => {
      state.isRunning = false;
      state.value = 0
      if(window.localStorage.getItem('timer')){
        window.localStorage.removeItem('timer')
      }
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
