import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signUpService } from "@/services/signUpService"
import { ERROR_TOAST_TITLE, GENERAL_ERROR_MESSAGE, HTTP_CREATED, HTTP_OK } from "@/constants"
import { toast } from "./ui/use-toast"
import { signInService } from "@/services/signInService"
import { UserSession } from "@/types"
import { useDispatch } from 'react-redux'
import { login } from "@/slices/userSlice"


const FormSchema = z.object({
  name: z.string({
    required_error: "Introduce tu nombre"
  }).min(2, 'El nombre debe tener mínimo 2 caracteres'),
  email: z.string().email('Debes introducir un email válido'),
  password: z.string({
    required_error: 'Debes introducir una contraseña válida'
  }).min(2, 'La contraseña debe ser más larga'),
  repeatPassword: z.string({
    required_error: 'Debes introducir una contraseña válida'
  }).min(2, 'La contraseña debe ser más larga')
})


export default function SignUpPage() {

  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: ''
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try{

      const storeResponse = await signUpService({
        email: data.email,
        password: data.password,
        name: data.name
      })
      
      if(storeResponse.status !== HTTP_CREATED){
        toast({
          title: ERROR_TOAST_TITLE,
          description: storeResponse?.message ?? GENERAL_ERROR_MESSAGE,
          variant: "destructive"
        })
        return
      }

      const loginResponse = await signInService({
        email: data.email,
        password: data.password
      })

      if(loginResponse.status !== HTTP_OK){
        toast({
          title: ERROR_TOAST_TITLE,
          description: loginResponse?.message ?? GENERAL_ERROR_MESSAGE,
          variant: "destructive"
        })
        return
      }

      const userData: UserSession = {
        token: loginResponse.data.token,
        user: {
          id: loginResponse.data.user.id,
          name: loginResponse.data.user.name,
          email: loginResponse.data.user.email
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
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
          <CardDescription>
            Introduce tus datos para crear una cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repetir contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Crear cuenta
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <a href="/sign-in" className="underline">
                  Iniciar sesión
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
