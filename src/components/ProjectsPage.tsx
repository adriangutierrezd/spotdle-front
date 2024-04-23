import { getProjects } from "@/services/projectsService";
import { Project } from "@/types";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ProjectsPage() {

  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { token } = useSelector((state) => {
    return state.userSession
  });

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await getProjects({ token })
      if (response.status !== 200) {
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive'
        })
      }

      setProjects(response.data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error inesperado',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
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
    },
    {
      header: "Acciones",
      accessorKey: "actions",
      cell: ({ row }) => <ProjectTableActions row={row} />
    }
  ]


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Tus proyectos</h1>

        <AlertDialog>
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
            
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Crear</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {isLoading ? (<TableSkeleton columns={['Nombre', 'Color', 'Acciones']} />) : (<DataTable columns={columns} data={projects} />)}
    </>
  )
}


interface ProjectTableActionsProps {
  readonly row: Row<Project>
}

const ProjectTableActions = ({ row }: ProjectTableActionsProps) => {

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
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" onClick={() => { setDeleteModalOpen(true) }}>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteModalOpen} onOpenChange={() => setDeleteModalOpen(!deleteModalOpen)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>

  )
}