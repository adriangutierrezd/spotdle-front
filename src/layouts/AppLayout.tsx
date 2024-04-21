import {
  BarChart2,
  CircleUser,
  Folders,
  Home,
  Hourglass,
  Menu,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import HeaderTimerForm from "@/components/HeaderTimerForm"
import DrawerTimerForm from "@/components/DrawerTimerForm"
import { useDispatch } from 'react-redux'
import { logout } from "@/slices/userSlice"


export default function AppLayout() {

  const location = useLocation();
  const { pathname } = location;

  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = '/'
  }

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
          <HeaderTimerForm />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} className="hover:cursor-pointer">Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
        <div className="block md:hidden">
          <DrawerTimerForm />
        </div>
      </div>
    </div>
  )
}
