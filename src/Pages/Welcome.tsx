import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import { useState } from 'react'
import { HStack, Text, VStack, Image, Button } from '@chakra-ui/react'
import { RootState } from '../redux/store/Store'
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount } from '../redux/feature/main'

export const Welcome = () => {
    const count = useSelector((state: RootState) => state.counter.value)
    const dispatch = useDispatch()

    return (
        <VStack >
            <VStack>
                <HStack>
                    <a href="https://vitejs.dev" target="_blank">
                        <Image boxSize="200px" src={viteLogo} className="logo " alt="Vite  " />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <Image boxSize="200px" src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </HStack>
                <Text fontSize="3xl" marginTop="30px">Vite React Boilerplate</Text>
                <div className="card">
                    <Button marginBottom="30px" onClick={() => dispatch(incrementByAmount(count + 5))}>
                        count is {count}
                    </Button>
                    <Text fontSize="2xl">
                        Edit <code>src/Page/Welcome.tsx</code> and save to test HMR
                    </Text>
                </div>
                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                </p>
                <Text fontWeight="bold" textTransform='uppercase' className="read-the-docs">
                   vite | react | typescript | chakraui | react-router
                </Text>

            </VStack>
        </VStack>
    )
}
