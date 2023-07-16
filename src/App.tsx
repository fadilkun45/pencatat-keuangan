import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { Main } from './Pages/Main'
import { Detailpage } from './Pages/Detail'

function App() {

  return (
   <ChakraProvider>
     <BrowserRouter>
      <Routes>
        <Route path='/' Component={Main} />
        <Route path='/detail' Component={Detailpage} />
      </Routes>
    </BrowserRouter>
   </ChakraProvider>
  )
}

export default App
