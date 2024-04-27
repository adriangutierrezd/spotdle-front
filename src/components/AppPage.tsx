import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deleteTask, getTasks } from "@/services/tasksService"
import { useEffect, useState } from "react"
import TasksList from "./TasksList"
import { Task, RootState } from "@/types"
import { useSelector } from 'react-redux'
import { ERROR_TOAST_TITLE, GENERAL_ERROR_MESSAGE, HTTP_OK } from "@/constants"
import { toast } from "./ui/use-toast"

export default function AppHome() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { token } = useSelector((state: RootState) => {
    return state.userSession
  });


  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await getTasks({
        token: token ?? '',
        running: 0
      })
      if (response.status !== HTTP_OK) {
        throw new Error(response?.message ?? GENERAL_ERROR_MESSAGE)
      }

      setTasks(response.data)

    } catch (error) {
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleTask = async (taskId: number) => {
    try{
      const response = await deleteTask({
        token: token ?? '',
        taskId
      })

      if(response.status !== HTTP_OK){
        throw new Error(response?.message ?? GENERAL_ERROR_MESSAGE)
      }

      setTasks(tasks.filter((task: Task) => task.id !== taskId))

    }catch(error){
      toast({
        title: ERROR_TOAST_TITLE,
        description: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
        variant: "destructive"
      })
    }
  }

  return (
    <Tabs defaultValue="week">
      <div className="flex justify-end">
        <TabsList>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mes</TabsTrigger>
          <TabsTrigger value="year">Año</TabsTrigger>
        </TabsList>
      </div>

      {!isLoading && (
        <>
          {tasks.length > 0 ? (<>
            <TabsContent value="week"><TasksList handleDeleTask={handleDeleTask} tasks={tasks} /></TabsContent>
            <TabsContent value="month"><TasksList handleDeleTask={handleDeleTask} tasks={tasks} /></TabsContent>
            <TabsContent value="year"><TasksList handleDeleTask={handleDeleTask} tasks={tasks} /></TabsContent>
          </>) : (<p>Aun no has añadido nnguna tarea</p>)}
        </>
      )}
    </Tabs>

  )
}
