import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTasks } from "@/services/tasksService"
import { useEffect, useState } from "react"
import TasksList from "./TasksList"
import { Task, RootState } from "@/types"
import { useSelector } from 'react-redux'
import { GENERAL_ERROR_MESSAGE, HTTP_OK } from "@/constants"

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
        token: token ?? ''
      })
      if (response.status !== HTTP_OK) {
        throw new Error(response?.message ?? GENERAL_ERROR_MESSAGE)
      }

      setTasks(response.data)

    } catch (error) {
      console.log({ error })
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


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
          <TabsContent value="week"><TasksList tasks={tasks} /></TabsContent>
          <TabsContent value="month"><TasksList tasks={tasks} /></TabsContent>
          <TabsContent value="year"><TasksList tasks={tasks} /></TabsContent>
        </>
      )}
    </Tabs>

  )
}
