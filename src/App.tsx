import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Main } from './Pages/Main'
import { Detailpage } from './Pages/Detail'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto min-h-dvh max-w-md px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Navbar />
        <Routes>
          <Route path='/' Component={Main} />
          <Route path='/detail' Component={Detailpage} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
