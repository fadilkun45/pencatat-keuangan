import { Button, Input, Text, VStack, useToast } from "@chakra-ui/react"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../redux/store/Store"
import { useEffect, useState } from 'react'
import { addList, deleteList, getList, MainList } from "../redux/feature/main"
import { MainBox } from "../components/MainBox"
import { v4 as uuidv4 } from 'uuid';
import { currencyToInteger, formatRupiah, onlyNumber } from "../lib/Formatter"
import ScrollToTop from "react-scroll-to-top"


export const Main = () => {
    const toast = useToast()

    const [newList, setNewList] = useState<MainList>()
    const list = useSelector((state: RootState) => state.mainList)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getList())
    }, [])

    const submit = () => {
        if (!newList?.title || !newList?.limit) {
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
        dispatch(addList({ ...newList, currentAmount: 0, createdAt: new Date().toISOString(), id: id }))
        setNewList({ ...newList, limit: 0, title: '' })
        dispatch(getList())
    }

    const Delete = (item: MainList) => {
        console.log(item)
        dispatch(deleteList(item))
        dispatch(getList())
    }



    return (
        <>
            <VStack >
                <VStack width="full" textAlign="left">
                    <Text width="full">Nama</Text>
                    <Input value={newList?.title} onChange={(v) => setNewList({ ...newList, title: v.target.value })} />
                    <Input type="checkbox"/>
                    <Text width="full" >Limit</Text>
                    <Input value={formatRupiah(newList?.limit || 0)} onChange={(v) => setNewList({ ...newList, limit: parseInt(onlyNumber(v.target.value)) })} />
                    <Button fontSize={{ 'sm': 'md' }} onClick={submit}>Submit</Button>
                </VStack>

                <VStack marginTop="40px" spacing="6" width="full" px="1" py="4" overflowY="auto">
                    {
                        list.map((item) => (
                            <MainBox handleClick={Delete} key={item.id} item={item} />
                        ))
                    }
                </VStack>
            </VStack>
            {/* <ScrollToTop smooth className="scrollTop" color="#6f00ff" /> */}
        </>

    )
}
