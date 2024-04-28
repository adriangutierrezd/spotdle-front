import { formatSecondsToTime } from "@/lib/utils"
import { Task } from "@/types"
import moment from "moment"
import { Button } from "./ui/button"
import { Ellipsis } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "./ui/input"
import ProjectSelector from "./ProjectSelector"

interface Props {
    readonly tasks: Task[]
    readonly handleDeleTask: (taskId: number) => void;
}

const EditTaskSchema = z.object({
    description: z.string().optional(),
    projectId: z.string().optional()
})


export default function TasksList({ tasks, handleDeleTask }: Props) {
    return (
        <>
            {tasks.map((task: Task) => {
                return (
                    <SingleTask handleDeleTask={handleDeleTask} key={task.id} task={task} className="p-4 bg-slate-50 rounded-md shadow-md my-3" />
                )
            })}
        </>
    )
}

interface SingleTaskProps {
    readonly className: string;
    readonly task: Task;
    readonly handleDeleTask: (taskId: number) => void;
}

const SingleTask = ({ className, task, handleDeleTask }: SingleTaskProps) => {

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)


    const form = useForm<z.infer<typeof EditTaskSchema>>({
        resolver: zodResolver(EditTaskSchema),
        defaultValues: {
            description: task.description ?? undefined,
            projectId: task.projectId ? task.projectId.toString() : undefined
        },
    })

    return (
        <>
            <div className={className}>
                <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold mb-3">{moment(task.date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                            >
                                <Ellipsis className="w-4 h-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {
                                setIsEditModalOpen(true)
                            }}>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {
                                setIsDeleteModalOpen(true)
                            }} >Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start space-x-4">
                        <p>{task.description}</p>
                        {task.project ? (
                            <div className="flex items-center justify-start space-x-2">
                                <div className="rounded-full h-2 w-2" style={{ backgroundColor: task.project.color }}></div>
                                <p>{task.project.name}</p>
                            </div>
                        ) : (
                            <p>Sin proyecto</p>
                        )}
                    </div>
                    <p>{formatSecondsToTime(task.seconds)}</p>
                </div>
            </div>

            <AlertDialog open={isDeleteModalOpen} onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Seguro que quieres eliminar esta tarea?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Al eliminarla sus datos se perderán para siempre.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            handleDeleTask(task.id)
                        }}>Borrar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isEditModalOpen} onOpenChange={() => setIsEditModalOpen(!isEditModalOpen)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Editar tarea</AlertDialogTitle>
                        <Form {...form}>
                            <form>
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tarea</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="¿Qué estás haciendo?" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <ProjectSelector width={300} defaultOption={task.projectId ? task.projectId.toString() : ''} onProjectSelected={(value) => {
                                        console.log(value)
                                    }} />

                                </div>
                            </form>
                        </Form>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction>Guardar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>

    )
}