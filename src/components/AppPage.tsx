import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function AppHome() {
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
