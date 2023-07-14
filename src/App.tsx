import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { Welcome } from './Pages/Welcome'

function App() {

  return (
   <ChakraProvider>
     <BrowserRouter>
      <Routes>
        <Route path='/' Component={Welcome} />
      </Routes>
    </BrowserRouter>
   </ChakraProvider>
  )
}

export default App
