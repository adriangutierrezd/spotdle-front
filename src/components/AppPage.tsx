import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTasks } from "@/services/tasksService"
import { useEffect, useState } from "react"

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

      <TabsContent value="week">Make changes to your account here.</TabsContent>
      <TabsContent value="month">Change your password here.</TabsContent>
      <TabsContent value="year">Change your password here.</TabsContent>
    </Tabs>

  )
}
