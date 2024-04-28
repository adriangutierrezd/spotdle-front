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
} from "@/components/ui/alert-dialog"
import { CORRECT_TOAST_TITLE, ERROR_TOAST_TITLE, GENERAL_ERROR_MESSAGE, HTTP_CREATED, HTTP_OK } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ProjectDialog from "./ProjectDialog";


export default function ProjectsPage() {

  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { token } = useSelector((state: RootState) => {
    return state.userSession
  });


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

  const handleCreateProject = async ({ name, color }: { name: string, color: string }) => {
    try {
      const response = await storeProject({
        token: token ?? '',
        props: {
          name,
          color,
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

        <ProjectDialog
          title="Añadir proyecto"
          trigger={
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Añadir proyecto
            </Button>} onSubmit={(values) => {
              handleCreateProject({
                name: values.name,
                color: values.color
              })
            }} />
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
          <ProjectDialog
            title="Editar proyecto"
            defaultColor={row.original.color}
            defaultName={row.original.name}
            trigger={
              <Button variant="ghost" className="font-normal justify-start px-2 w-full hover:cursor-pointer">Editar</Button>
            } onSubmit={(values) => {
              handleUpdateProject({
                projectId: row.original.id,
                name: values.name,
                color: values.color
              })
            }} />
          <DropdownMenuItem className="hover:cursor-pointer" onClick={() => { setDeleteModalOpen(true) }}>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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