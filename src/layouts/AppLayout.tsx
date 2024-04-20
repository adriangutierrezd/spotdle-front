import {
  BarChart2,
  CircleUser,
  Folders,
  Home,
  Hourglass,
  Menu,
  Play,
  Plus,
  Square,
} from "lucide-react"
import { NavLink, useLocation, Outlet } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSelector, useDispatch } from 'react-redux'
import { start, increment, stop } from "@/slices/timerSlice"
import { useEffect, useState } from "react"
import { TimerReducer } from "@/types"
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



export default function AppLayout() {

  const location = useLocation();
  const { pathname } = location;

  const [open, setOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)

  const [projectValue, setProjectValue] = useState("")
  const [projects, setProjects] = useState<any[]>([])


  useEffect(() => {
    const projectsData = getProjects()
    const { data } = projectsData
    setProjects(data)
  }, [])

  const dispatch = useDispatch();
  const { isRunning, value } = useSelector((state: TimerReducer) => {
    return state.timer
  });

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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <NavLink to="/app" className="flex items-center gap-2 font-semibold">
              <Hourglass className="h-6 w-6" />
              <span className="">Time tracker</span>
            </NavLink>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink
                to="/app"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === '/app' ? 'bg-muted text-primary hover:text-primary' : 'text-muted-foreground hover:text-primary text-muted-foreground hover:text-primary'}`}
              >
                <Home className="h-4 w-4" />
                Panel de control
              </NavLink>
              <NavLink
                to="/app/projects"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === '/app/projects' ? 'bg-muted text-primary hover:text-primary' : 'text-muted-foreground hover:text-primary text-muted-foreground hover:text-primary'}`}
              >
                <Folders className="h-4 w-4" />
                Proyectos
              </NavLink>
              <NavLink
                to="/app/stats"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === '/app/stats' ? 'bg-muted text-primary hover:text-primary' : 'text-muted-foreground hover:text-primary text-muted-foreground hover:text-primary'}`}
              >
                <BarChart2 className="h-4 w-4" />
                Estadísticas
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 justify-between items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <NavLink
                  to="/app"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Hourglass className="h-6 w-6" />
                  <span className="sr-only">Time tracker</span>
                </NavLink>
                <NavLink
                  to="/app"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/app' ? 'bg-muted text-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground'} `}
                >
                  <Home className="h-5 w-5" />
                  Panel de control
                </NavLink>
                <NavLink
                  to="/app/projects"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/app/projects' ? 'bg-muted text-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground'} `}
                >
                  <Folders className="h-5 w-5" />
                  Proyectos
                </NavLink>
                <NavLink
                  to="/app/stats"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === '/app/stats' ? 'bg-muted text-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground'} `}
                >
                  <BarChart2 className="h-5 w-5" />
                  Estadísticas
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex w-full flex-1 flex space-x-2 items-center">
            <form className="flex-1">
              <div className="relative">
                <Plus className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
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
                  className="w-[200px] justify-between"
                >
                  {projectValue
                    ? projects.find((project) => Number(project.id) === Number(projectValue))?.name
                    : "Selecciona un proyecto..."}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
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
            <p>{formatSecondsToTime(value)}</p>
            {isRunning ? (<Button type="button" onClick={handleStop} variant="outline" className="rounded-full">
              <Square className="h-4 w-4" />
            </Button>) : (
              <Button type="button" onClick={handleStart} variant="outline" className="rounded-full">
                <Play className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />

        </main>
        <div className="flex md:hidden space-x-2 items-center justify-between px-2 py-6 bg-muted">
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
      </div>
    </div>
  )
}
