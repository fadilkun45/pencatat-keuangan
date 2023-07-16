import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Input, Text, VStack } from "@chakra-ui/react"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../redux/store/Store"
import { useEffect, useState } from 'react'
import { addList, getList, MainList } from "../redux/feature/main"
import { MainBox } from "../components/MainBox"
import { v4 as uuidv4 } from 'uuid';


export const Main = () => {

    const [newList, setNewList] = useState<MainList>()
    const list = useSelector((state: RootState) => state.mainList)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(list)
        dispatch(getList())
    }, [list])

    const submit = () => {
        const id = uuidv4()
        dispatch(addList({ ...newList, currentAmount: 0, id: id }))
    }

    return (
        <VStack>
            <Text>Nama</Text>
            <Input onChange={(v) => setNewList({ ...newList, title: v.target.value })} />
            <Text>Max Bugdet</Text>
            <Input onChange={(v) => setNewList({ ...newList, limit: parseInt(v.target.value) })} />
            <Button onClick={submit}>Submit</Button>

            <VStack marginTop="40px" spacing="6" width="full">
                {
                    list.map((item) => (
                       <MainBox item={item} />
                    ))
                }

            </VStack>
        </VStack>
    )
}
