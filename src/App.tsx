import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { ChakraProvider, Container, VStack } from '@chakra-ui/react'
import { Main } from './Pages/Main'
import { Detailpage } from './Pages/Detail'
import { Navbar } from './components/Navbar'

function App() {

  return (
    <ChakraProvider >
      <Container  w={{"xs": "330px"}}>
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route path='/' Component={Main} />
            <Route path='/detail' Component={Detailpage} />
          </Routes>
        </BrowserRouter>
      </Container>
    </ChakraProvider>
  )
}

export default App
