import { getProjects, storeProject } from "@/services/projectsService";
import { Project, RootState } from "@/types";
import { useEffect, useState } from "react"
import { toast } from "./ui/use-toast";
import { CORRECT_TOAST_TITLE, ERROR_TOAST_TITLE, GENERAL_ERROR_MESSAGE, HTTP_CREATED, HTTP_OK } from "@/constants";
import { useSelector } from "react-redux";
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
import { Button } from "./ui/button";
import { Command as NativeCommand } from "cmdk"
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Plus } from "lucide-react";
import ProjectDialog from "./ProjectDialog";


interface Props {
    readonly defaultOption?: string;
    readonly width?: number;
    readonly onProjectSelected: (projectId: string) => void;
}

export default function ProjectSelector({ width = 250, defaultOption = '', onProjectSelected }: Props) {

    const [open, setOpen] = useState<boolean>(false)
    const [projectValue, setProjectValue] = useState<string>(defaultOption)
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { token } = useSelector((state: RootState) => {
        return state.userSession
    });

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
      setProjectValue(response.data.id.toString())

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

    const fetchData = async () => {
        try {

            setIsLoading(true)
            const response = await getProjects({ token: token ?? '' })
            if (response.status !== HTTP_OK) {
                toast({
                    title: CORRECT_TOAST_TITLE,
                    description: response?.message ?? GENERAL_ERROR_MESSAGE
                })
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

    useEffect(() => {
        if (!isNaN(Number(projectValue))) {
            onProjectSelected(projectValue)
        }
    }, [])


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-[${width}px] justify-between`}
                >
                    {projectValue
                        ? projects.find((project) => Number(project.id) === Number(projectValue))?.name
                        : "Selecciona un proyecto..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-[${width}px] p-0`}>
                <Command>
                    <CommandInput placeholder="Busca un proyecto..." className="h-9" />
                    <CommandEmpty className="p-0">
                        <p className="p-4 text-sm">Proyecto no encontrado</p>
                        <Separator />
                        <ProjectDialog trigger={
                            <Button variant="ghost" className="flex w-full cursor-pointer py-2 items-center justify-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Crear un nuevo proyecto
                            </Button>
                        } title="Añadir proyecto" onSubmit={(values) => {
                            handleCreateProject({
                              name: values.name,
                              color: values.color
                            })
                          }} />
                    </CommandEmpty>
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
    )

}