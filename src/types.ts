export interface TimerState {
    value: number;
    isRunning: boolean;
  }
  

  export interface TimerReducer {
    timer: TimerState
  }
  