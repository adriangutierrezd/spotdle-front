import { createSlice } from '@reduxjs/toolkit';
import { TimerState } from '@/types';
import moment from 'moment';

const defaultInitialState: TimerState = {
  isRunning: false,
  value: 0
};

const getInitialState = (): TimerState => {
  const auxInitialState: string|null = window.localStorage.getItem('timer')
  if(!auxInitialState){
    return defaultInitialState
  }

  const auxInitialStateData = JSON.parse(auxInitialState)
  const timerInit = moment(auxInitialStateData.startMoment)
  const actualMoment = moment();

  return {
    isRunning: true,
    value: actualMoment.diff(timerInit, 'seconds')
  }

}

export const timerSlice = createSlice({
  name: 'timer',
  initialState: getInitialState(),
  reducers: {
    start: (state) => {
      if(state.isRunning === true) return
      state.isRunning = true;
      state.value = 0
      window.localStorage.setItem('timer', JSON.stringify({startMoment: new Date()}))
    },
    stop: (state) => {
      state.isRunning = false;
      state.value = 0;
      if(window.localStorage.getItem('timer')){
        window.localStorage.removeItem('timer')
      }
    },
    update: (state) => {
      const timer = window.localStorage.getItem('timer')
      let startDate = new Date()
      if(timer){
        const data = JSON.parse(timer)
        startDate = data.startMoment
      }
      const timerInit = moment(startDate)
      const actualMoment = moment();
      state.value = isNaN(actualMoment.diff(timerInit, 'seconds')) ? 0 : actualMoment.diff(timerInit, 'seconds')
    },
  },
});

// Exporta los action creators y el reducer
export const { start, stop, update } = timerSlice.actions;

export default timerSlice.reducer;
