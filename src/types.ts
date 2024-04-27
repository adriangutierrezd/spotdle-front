export interface TimerState {
    value: number;
    isRunning: boolean;
  }
  
  export interface TimerReducer {
    timer: TimerState
  }

export interface Project {
  name: string;
  color: string;
  userId: number;
  id: number;
}

  export interface UserData {
    id: number;
    name: string;
    email: string;
  }


  export interface UserSession {
    token: string | null;
    user: UserData | null;
  }


  export interface RootState {
    userSession: UserSession,
    timer: TimerState
  }

  export interface Task {
    id: number;
    userId: number;
    projectId: number | null;
    project: Project | null;
    description: string | null;
    date: string;
    running: boolean;
    seconds: number;
    startedAt: string;
    endedAt: string | null;
  }