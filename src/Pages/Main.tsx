import { Button, Checkbox, HStack, Input, Text, VStack, useToast } from "@chakra-ui/react"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../redux/store/Store"
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { addList, deleteList, getList, MainList } from "../redux/feature/main"
import { MainBox } from "../components/MainBox"
import { v4 as uuidv4 } from 'uuid';
import { currencyToInteger, formatRupiah, onlyNumber } from "../lib/Formatter"
import ScrollToTop from "react-scroll-to-top"
import dayjs from "dayjs"


export const Main = () => {
    const toast = useToast()

    const [newList, setNewList] = useState<MainList>({
        limit: 0,
    })
    const list = useSelector((state: RootState) => state.mainList)
    const [checked, setChecked] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getList())
    }, [])

    const submit = () => {
        if (!newList?.title) {
            toast({
                title: 'Title belum di isi',
                position: 'top-right',
                isClosable: true,
                duration: 1000,
                colorScheme: "red",
            })
            return
        }

        if(checked){
            setChecked(false)
        }


        const id = uuidv4()
        dispatch(addList({ ...newList, currentAmount: 0,  createdAt: new Date().toISOString(), id }))
        setNewList({ ...newList, limit: 0, title: '' })
        dispatch(getList())
    }

    const Delete = (item: MainList) => {
        dispatch(deleteList(item))
        dispatch(getList())
    }

    const handleChecked = (v: ChangeEvent<HTMLInputElement>) => {
        setChecked(v.target.checked)
        if(v.target.checked){
            setNewList({...newList, title: dayjs().format("DD MMMM YYYY")})
        }else{
            setNewList({...newList, title: ""})
        }
    }
  


    return (
        <>
            <VStack >
                <VStack width="full" textAlign="left">
                    <Text width="full">Nama</Text>
                    <Input disabled={checked}  value={newList?.title} onChange={(v) => setNewList({ ...newList, title: v.target.value })} />
                   <HStack w="full"> <Checkbox isChecked={checked} onChange={(v) => handleChecked(v)}/> <Text>Nama Menggunakan Tanggal</Text></HStack>
                    <Text width="full" >Limit</Text>
                    <Input  value={formatRupiah(newList?.limit || 0)} onChange={(v) => setNewList({ ...newList, limit: parseInt(onlyNumber(v.target.value)) })} />
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
