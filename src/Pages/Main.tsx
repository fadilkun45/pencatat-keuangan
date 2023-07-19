import { Button, Input, Text, VStack, useToast } from "@chakra-ui/react"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../redux/store/Store"
import { useEffect, useState } from 'react'
import { addList, deleteList, getList, MainList } from "../redux/feature/main"
import { MainBox } from "../components/MainBox"
import { v4 as uuidv4 } from 'uuid';
import { currencyToInteger } from "../lib/Formatter"


export const Main = () => {
    const toast = useToast()
    
    const [newList, setNewList] = useState<MainList>()
    const list = useSelector((state: RootState) => state.mainList)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getList())
    }, [])

    const submit = () => {
        if(!newList?.title || !newList?.limit){
            toast({
                title: 'Title atau Bugdet Belum Di isi',
                position: 'top-right',
                isClosable: true,
                duration: 1000,
                colorScheme: "red",
              })
              return
        }


        const id = uuidv4()
        dispatch(addList({ ...newList, currentAmount: 0, id: id }))
        setNewList({...newList, limit: 0, title: ''})
        dispatch(getList())
    }

    const Delete = (item: MainList) => {
        console.log(item)
        dispatch(deleteList(item))
        dispatch(getList())
    }

    return (
        <VStack>
            <VStack width="full" textAlign="left">
                <Text width="full">Nama</Text>
                <Input onChange={(v) => setNewList({ ...newList, title: v.target.value })} />
                <Text width="full" >Limit</Text>
                <Input value={newList?.currentAmount}  onChange={(v) => setNewList({ ...newList, limit: currencyToInteger(v.target.value) })} />
                <Button fontSize={{'sm': 'md'}} onClick={submit}>Submit</Button>
            </VStack>

            <VStack marginTop="40px" spacing="6" width="full">
                {
                  list.map((item) => (
                        <MainBox handleClick={Delete} key={item.id} item={item} />
                    ))
                }
            </VStack>
        </VStack>
    )
}
