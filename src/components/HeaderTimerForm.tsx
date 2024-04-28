import { formatSecondsToTime, cn } from "@/lib/utils"
import { getProjects } from "@/services/projectsService"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Command as NativeCommand } from "cmdk"
import {
  Play,
  Plus,
  Square,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSelector, useDispatch } from 'react-redux'
import { start, stop, update } from "@/slices/timerSlice"
import { useEffect, useState } from "react"
import { Project, RootState, Task, TimerReducer } from "@/types"
import { CORRECT_TOAST_TITLE, ERROR_TOAST_TITLE, GENERAL_ERROR_MESSAGE, HTTP_OK } from "@/constants"
import { getTasks, storeTask, updateTask } from "@/services/tasksService"
import { toast } from "./ui/use-toast"
import moment from "moment"
import ProjectSelector from "./ProjectSelector"

export default function HeaderTimerForm() {

  const [projectValue, setProjectValue] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [taskDescription, setTaskDescription] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const dispatch = useDispatch();
  const [onGoinTask, setOnGoinTask] = useState<Task>()
  const { isRunning, value } = useSelector((state: TimerReducer) => {
    return state.timer
  });

  const { token } = useSelector((state: RootState) => {
    return state.userSession
  });


  const fetchData = async () => {
    try {

      setIsLoading(true)
      const taskResponse = await getTasks({
        token: token ?? '',
        running: 1
      })
      const response = await getProjects({ token: token ?? '' })
      if (response.status !== HTTP_OK) {
        toast({
          title: CORRECT_TOAST_TITLE,
          description: response?.message ?? GENERAL_ERROR_MESSAGE
        })
      }

      if(taskResponse.status !== HTTP_OK){
        toast({
          title: CORRECT_TOAST_TITLE,
          description: taskResponse?.message ?? GENERAL_ERROR_MESSAGE
        })
      }

      if(taskResponse.data.length > 0){
        const defaultOnGoinTask = taskResponse.data[taskResponse.data.length - 1]
        if(!window.localStorage.getItem('timer')){
          window.localStorage.setItem('timer', JSON.stringify({startMoment: moment(defaultOnGoinTask.startedAt, 'YYYY-MM-DD HH:mm:ss').toDate()}))
        }
        dispatch(update())
        setOnGoinTask(defaultOnGoinTask)
        setProjectValue(defaultOnGoinTask.projectId)
        setTaskDescription(defaultOnGoinTask.description)
      }else{
        dispatch(stop())
      }

      setProjects(response.data)
    } catch (error) {
      toast({
        title: ERROR_TOAST_TITLE,
        description: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  const handleStart = async () => {
    try {
      const response = await storeTask({
        token: token ?? '',
        props: {
          description: taskDescription,
          projectId: projectValue.length > 0 ? projectValue : null,
          running: true,
          seconds: 0,
          started_at: new Date()
        }
      })
      dispatch(start());
      setOnGoinTask(response.data)

    } catch (error) {
      console.log({ error })
    }
  };

  const handleStop = async () => {
    try{
      dispatch(stop());
      if(onGoinTask){
        await updateTask({
          token: token ?? '',
          taskId: onGoinTask.id,
          props: {
            running: false,
            endedAt: new Date(),
            seconds: value
          }
        })
      }
    }catch(error){
      console.log({error})
    }
  };

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        dispatch(update())
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isRunning, dispatch]);

  useEffect(() => {
    if(onGoinTask){
      console.log({projectValue})
      updateTask({
        token: token ?? '',
        taskId: onGoinTask.id,
        props: {
          projectId: isNaN(Number(projectValue)) ? null : Number(projectValue),
          description: taskDescription
        }
      })
    }
  }, [projectValue, taskDescription])

  return (
    <div className="hidden md:flex w-full flex-1 flex space-x-2 items-center">
      <form className="flex-1">
        <div className="relative">
          <Plus className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={taskDescription ?? ''}
            onChange={(event) => {
              setTaskDescription(event.target.value)
            }}
            type="text"
            placeholder="¿En qué estás trabajando?"
            className="w-full appearance-none bg-background pl-8 shadow-none"
          />
        </div>
      </form>
      <ProjectSelector onProjectSelected={(value) => { setProjectValue(value) }} />
      <p>{formatSecondsToTime(value)}</p>
      {isRunning ? (<Button type="button" onClick={handleStop} variant="outline" className="rounded-full">
        <Square className="h-4 w-4" />
      </Button>) : (
        <Button type="button" onClick={handleStart} variant="outline" className="rounded-full">
          <Play className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}