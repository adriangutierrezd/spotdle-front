import { Route, Routes } from 'react-router-dom'
import SignUpPage from './components/sign-up-page'
import AppLayout from './layouts/AppLayout'
import AppHome from './components/AppHome'

function App() {

  return (
    <Routes>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<AppHome />} />
      </Route>
      <Route path='/sign-up' element={<SignUpPage />} />
    </Routes>
  )
}

export default App
