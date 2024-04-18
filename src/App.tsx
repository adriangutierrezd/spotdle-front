import { Route, Routes } from 'react-router-dom'
import SignUpPage from './components/SignUpPage'
import AppLayout from './layouts/AppLayout'
import AppHome from './components/AppPage'
import ProjectsPage from './components/ProjectsPage'
import StatsPage from './components/StatsPage'

function App() {

  return (
    <Routes>
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<AppHome />} />
        <Route path='/app/projects' element={<ProjectsPage />} />
        <Route path='/app/stats' element={<StatsPage />} />
      </Route>
      <Route path='/sign-up' element={<SignUpPage />} />
    </Routes>
  )
}

export default App
