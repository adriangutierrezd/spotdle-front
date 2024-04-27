import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { signInService } from "@/services/signInService"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch } from 'react-redux'
import { login } from "@/slices/userSlice"
import { UserSession } from "@/types"
import { ERROR_TOAST_TITLE, GENERAL_ERROR_MESSAGE, HTTP_OK } from "@/constants"

const FormSchema = z.object({
  email: z.string().email('Debes introducir un email válido'),
  password: z.string({
    required_error: 'Debes introducir una contraseña válida'
  }).min(2, 'La contraseña debe ser más larga')
})

export default function SignInPage() {

  const dispatch = useDispatch()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try{

      const response = await signInService({
        email: data.email,
        password: data.password
      })
      
      if(response.status !== HTTP_OK){
        toast({
          title: ERROR_TOAST_TITLE,
          description: response?.message ?? GENERAL_ERROR_MESSAGE,
          variant: "destructive"
        })
        return
      }

      const userData: UserSession = {
        token: response.data.token,
        user: {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email
        }
      }
 
      dispatch(login(userData))
      window.location.href = '/app'

    }catch(error){
      toast({
        title: ERROR_TOAST_TITLE,
        description: error instanceof Error ? error.message : GENERAL_ERROR_MESSAGE,
        variant: "destructive"
      })
    }
  }

  return (
    <main className="flex items-center justify-center h-screen p-2">
      <Card className="mx-auto w-96">
        <CardHeader>
          <CardTitle className="text-xl">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password"  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Iniciar sesión
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿Aún no tienes cuenta?{" "}
                <a href="/sign-up" className="underline">
                  Crear una
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
