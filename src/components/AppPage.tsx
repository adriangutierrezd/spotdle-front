import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTasks } from "@/services/tasksService"
import { useEffect, useState } from "react"
import TasksList from "./TasksList"

export default function AppHome() {

  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const tasksData = getTasks()
    const { data } = tasksData

    setTasks(data)
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

      <TabsContent value="week"><TasksList tasks={tasks} /></TabsContent>
      <TabsContent value="month"><TasksList tasks={tasks} /></TabsContent>
      <TabsContent value="year"><TasksList tasks={tasks} /></TabsContent>
    </Tabs>

  )
}
