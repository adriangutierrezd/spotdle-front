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

  export interface Task{
    name: string;
    userId: number;    
    id: number;
    projectId: number;
    active: false,
    date: string;
    startedAt: string;
    endedAt: string | null;
    seconds: number;
    project: Project
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
