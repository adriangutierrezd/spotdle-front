import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import '../app/globals.css'
import {store} from '../src/store.ts'
import { Provider } from 'react-redux'
import { Toaster } from "@/components/ui/toaster"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <Provider store={store}>
      <App />
      <Toaster />
  </Provider>
  </BrowserRouter>,
)
