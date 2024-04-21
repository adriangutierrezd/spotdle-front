import { Route, Routes } from 'react-router-dom'
import SignUpPage from './components/SignUpPage'
import AppLayout from './layouts/AppLayout'
import AppHome from './components/AppPage'
import ProjectsPage from './components/ProjectsPage'
import StatsPage from './components/StatsPage'
import SignInPage from './components/SignInPage'

function App() {

  const path = window.location.pathname

  if(!window.localStorage.getItem('userSession') && !['/sign-in', '/sign-up'].includes(path)){
    window.location.href = '/sign-in'
    return 
  }


  return (
    <Routes>
      <Route path="/" element={<p>Home Page</p>} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<AppHome />} />
        <Route path='/app/projects' element={<ProjectsPage />} />
        <Route path='/app/stats' element={<StatsPage />} />
      </Route>
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='/sign-in' element={<SignInPage />} />
    </Routes>
  )
}

export default App
