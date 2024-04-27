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
import { Project, RootState, TimerReducer } from "@/types"
import { HTTP_OK } from "@/constants"
import { storeTask } from "@/services/tasksService"

export default function HeaderTimerForm() {

  const [open, setOpen] = useState(false)

  const [projectValue, setProjectValue] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [taskDescription, setTaskDescription] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const dispatch = useDispatch();
  const { isRunning, value } = useSelector((state: TimerReducer) => {
    return state.timer
  });

  const { token } = useSelector((state: RootState) => {
    return state.userSession
  });


  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await getProjects({ token: token ?? '' })
      if (response.status !== HTTP_OK) {
        // TODO
      }

      setProjects(response.data)
    } catch (error) {
      // TODO
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  const handleStart = async () => {
    dispatch(start());
    try {

      const timerStg = window.localStorage.getItem('timer')
      if (!timerStg) {
        // TODO
        return
      }

      const timerData = JSON.parse(timerStg)

      const response = await storeTask({
        token: token ?? '',
        props: {
          description: taskDescription,
          projectId: projectValue.length > 0 ? projectValue : null,
          running: true,
          seconds: 0,
          started_at: timerData.startMoment
        }
      })

      console.log({ response })
    } catch (error) {
      console.log({ error })
    }
  };

  const handleStop = () => {
    // TODO
    /**
     *  Debemos mandar una llamada al backend para 2 actualizar la tarea y dejar constancia del momento de finalización
     */
    dispatch(stop());
  };

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        dispatch(update())
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isRunning, dispatch]);



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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            {projectValue
              ? projects.find((project) => Number(project.id) === Number(projectValue))?.name
              : "Selecciona un proyecto..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Busca un proyecto..." className="h-9" />
            <CommandEmpty>Proyecto no encontrado</CommandEmpty>
            <CommandGroup>
              <NativeCommand.List>
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.id.toString()}
                    onSelect={(currentValue) => {
                      setProjectValue(currentValue === projectValue ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <span className="flex items-center space-x-4">
                      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: project.color }}></div>
                      {project.name}
                    </span>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        projectValue === project.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </NativeCommand.List>

            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
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