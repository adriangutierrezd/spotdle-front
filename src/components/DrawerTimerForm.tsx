
import { Input } from "@/components/ui/input"
import { useSelector, useDispatch } from 'react-redux'
import { start, increment, stop } from "@/slices/timerSlice"
import { useEffect, useState } from "react"
import { Project, TimerReducer } from "@/types"
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Play, Square } from "lucide-react"



export default function DrawerTimerForm(){

    const [openMobile, setOpenMobile] = useState(false)
    const [projectValue, setProjectValue] = useState("")
    const [projects, setProjects] = useState<Project[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const dispatch = useDispatch();
    const { isRunning, value } = useSelector((state: TimerReducer) => {
      return state.timer
    });

    const {token} = useSelector((state) => {
      return state.userSession
    });
  
    const fetchData = async () => {
      try{
        setIsLoading(true)
        const response = await getProjects({ token })
        if(response.status !== 200){
          // TODO
        }
  
        setProjects(response.data)
      }catch(error){
        // TODO
      }finally{
        setIsLoading(false)
      }
    }
  
    useEffect(() => {
      fetchData()
    }, [])

  

    const handleStart = () => {
      // TODO
      /**
       *  Aquí deberíamos hacer una llamada al backend para crear la tarea en así junto con su fecha de inicio para 
       *  poder hacer un tracking correcto del tiempo
       * 
       */
      dispatch(start());
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
            dispatch(increment());
          }, 1000);
    
          return () => clearInterval(intervalId);
        }
      }, [isRunning, dispatch]);

    return (
        <div className="flex space-x-2 items-center justify-between px-2 py-6 bg-muted">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" onClick={() => {
              dispatch(start())
            }} className="w-full justify-start">
              ¿En qué estás trabajando?
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4">
              <p className="mb-3">{formatSecondsToTime(value)}</p>
              <Input
                type="text"
                placeholder="¿En qué estás trabajando?"
                className="w-full appearance-none bg-background shadow-none mb-3"
              />
              <Popover open={openMobile} onOpenChange={setOpenMobile}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openMobile}
                    className="w-full justify-between"
                  >
                    {projectValue
                      ? projects.find((project) => Number(project.id) === Number(projectValue))?.name
                      : "Selecciona un proyecto..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
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
                              setOpenMobile(false)
                            }}
                          >
                            {project.name}
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
            </div>
            <DrawerFooter>
              <Button>Guardar</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

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