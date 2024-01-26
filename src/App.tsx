import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ChakraProvider, VStack } from '@chakra-ui/react'
import { Main } from './Pages/Main'
import { Detailpage } from './Pages/Detail'
import { Navbar } from './components/Navbar'

function App() {

  return (
   <ChakraProvider >
    <Navbar />
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
