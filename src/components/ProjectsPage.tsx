import { deleteProject, getProjects, storeProject, updateProject } from "@/services/projectsService";
import { Project, RootState } from "@/types";
import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { useToast } from "./ui/use-toast";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "./Datatable";
import { TableSkeleton } from "./Skeletons";
import { Button } from "./ui/button";
import { EllipsisVertical, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "./ui/input";
import { AVAILABLE_COLORS, CORRECT_TOAST_TITLE, ERROR_TOAST_TITLE, GENERAL_ERROR_MESSAGE, HTTP_CREATED, HTTP_OK } from "@/constants";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const projectNameHasValidLength = (projectName: string) => {
  return projectName.trim().length > 2 && projectName.length < 100
}

export default function ProjectsPage() {

  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedColor, setSelectedColor] = useState<string>(AVAILABLE_COLORS[0])
  const [projectName, setProjectName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const { token } = useSelector((state: RootState) => {
    return state.userSession
  });

  const resetForm = () => {
    setProjectName('')
    setSelectedColor(AVAILABLE_COLORS[0])
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await getProjects({ token: token ?? '' })

      if (response.status !== HTTP_OK) {
        throw new Error(response?.message ?? GENERAL_ERROR_MESSAGE)
      }

      setProjects(response.data)
    } catch (error) {
      toast({
        title: ERROR_TOAST_TITLE,
        description: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    try {
      const response = await deleteProject({
        token: token ?? '',
        projectId
      })

      if (response.status !== HTTP_OK) {
        throw new Error(response?.message ?? GENERAL_ERROR_MESSAGE)
      }

      setProjects(projects.filter((project: Project) => project.id != projectId))
      toast({
        title: CORRECT_TOAST_TITLE,
        description: response.message
      })

    } catch (error) {
      toast({
        title: ERROR_TOAST_TITLE,
        description: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
        variant: "destructive"
      })

    }
  }

  const handleUpdateProject = async ({ projectId, name, color }: { projectId: number, name: string, color: string }) => {
    try {
      const response = await updateProject({
        token: token ?? '',
        name,
        color,
        projectId
      })

      if (response.status !== HTTP_OK) {
        throw new Error(response?.message ?? GENERAL_ERROR_MESSAGE)
      }

      const index = projects.findIndex((project: Project) => project.id == projectId)
      const updatedData = [...projects]
      updatedData[index] = response.data
      setProjects(updatedData)

      toast({
        title: CORRECT_TOAST_TITLE,
        description: response.message
      })
    } catch (error) {
      toast({
        title: ERROR_TOAST_TITLE,
        description: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
        variant: 'destructive'
      })
    }

  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault()
    setErrorMessage('')

    if (!projectNameHasValidLength(projectName)) {
      setErrorMessage('El nombre debe tener entre 2 y 100 caracteres')
      return
    }

    try {
      const response = await storeProject({
        token: token ?? '',
        props: {
          name: projectName,
          color: selectedColor
        }
      })

      if (response.status !== HTTP_CREATED) {
        throw new Error(response?.message ?? GENERAL_ERROR_MESSAGE)
      }

      setProjects([...projects, response.data])

      toast({
        title: CORRECT_TOAST_TITLE,
        description: response.message
      })
      setOpenDialog(false)
      resetForm()
    } catch (error) {
      toast({
        title: ERROR_TOAST_TITLE,
        description: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
        variant: 'destructive'
      })
    }

  }

  useEffect(() => {
    fetchData()
  }, [])

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger style={{
                backgroundColor: row.original.color
              }} className="h-6 w-6 cursor-pointer rounded-full"></TooltipTrigger>
              <TooltipContent>
                <p>{row.original.color}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => <ProjectTableActions handleUpdateProject={handleUpdateProject} handleDeleteProject={handleDeleteProject} row={row} />
    }
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Tus proyectos</h1>

        <AlertDialog open={openDialog} onOpenChange={() => {
          setOpenDialog(!openDialog)
        }}>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Añadir proyecto
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Crea un nuevo proyecto</AlertDialogTitle>
            </AlertDialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="h-6 w-6 cursor-pointer rounded-full mt-5" style={{
                      backgroundColor: selectedColor
                    }}></button></PopoverTrigger>
                  <PopoverContent asChild>
                    <div className="w-[200px] grid grid-cols-4 gap-4 p-4">
                      {AVAILABLE_COLORS.map((color: string) => {
                        return (
                          <button key={color} onClick={() => {
                            setSelectedColor(color)
                          }} className={`h-6 w-6 cursor-pointer rounded-full ${color === selectedColor ? 'border border-1 border-black' : ''}`} style={{
                            backgroundColor: color
                          }}>
                          </button>
                        )
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex-1">
                  <Label>Nombre</Label>
                  <Input value={projectName} onChange={(e) => {
                    setProjectName(e.target.value)
                  }} type="text" />
                </div>
              </div>
              {errorMessage.length > 0 && (
                <span className="text-red-500">{errorMessage}</span>
              )}
              <AlertDialogFooter >
                <AlertDialogCancel onClick={resetForm} type="button">Cancelar</AlertDialogCancel>
                <Button type="submit">Guardar</Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {isLoading ? (<TableSkeleton columns={['Nombre', 'Color', 'Acciones']} />) : (<DataTable columns={columns} data={projects} />)}
    </>
  )
}


interface ProjectTableActionsProps {
  readonly row: Row<Project>;
  readonly handleDeleteProject: (projectId: number) => void;
  readonly handleUpdateProject: ({ projectId, name, color }: { projectId: number, name: string, color: string }) => void;
}

const ProjectTableActions = ({ row, handleDeleteProject, handleUpdateProject }: ProjectTableActionsProps) => {

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [selectedColor, setSelectedColor] = useState<string>(row.original.color)
  const [projectName, setProjectName] = useState<string>(row.original.name)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (!projectNameHasValidLength(projectName)) {
      setErrorMessage('El nombre debe tener entre 2 y 100 caracteres')
      return
    }

    handleUpdateProject({
      projectId: row.original.id,
      name: projectName,
      color: selectedColor
    })
  }


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-haspopup="true"
            size="icon"
            variant="ghost"
          >
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="hover:cursor-pointer" onClick={() => { setEditModalOpen(true) }}>Editar</DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" onClick={() => { setDeleteModalOpen(true) }}>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={editModalOpen} onOpenChange={() => setEditModalOpen(!editModalOpen)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar proyecto</AlertDialogTitle>
          </AlertDialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="h-6 w-6 cursor-pointer rounded-full mt-5" style={{
                    backgroundColor: selectedColor
                  }}></button></PopoverTrigger>
                <PopoverContent asChild>
                  <div className="w-[200px] grid grid-cols-4 gap-4 p-4">
                    {AVAILABLE_COLORS.map((color: string) => {
                      return (
                        <button key={color} onClick={() => {
                          setSelectedColor(color)
                        }} className={`h-6 w-6 cursor-pointer rounded-full ${color === selectedColor ? 'border border-1 border-black' : ''}`} style={{
                          backgroundColor: color
                        }}>
                        </button>
                      )
                    })}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="flex-1">
                <Label>Nombre</Label>
                <Input value={projectName} onChange={(e) => {
                  setProjectName(e.target.value)
                }} type="text" />
              </div>
            </div>
            {errorMessage.length > 0 && (
              <span className="text-red-500">{errorMessage}</span>
            )}
            <AlertDialogFooter >
              <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
              <Button type="submit">Guardar</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteModalOpen} onOpenChange={() => setDeleteModalOpen(!deleteModalOpen)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Seguro que quieres eliminar este proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Al eliminarlo, se elimarán todas las tareas asociadas al mismo y no podrás recuperar estos datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              handleDeleteProject(row.original.id)
            }}>Borrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>

  )
}