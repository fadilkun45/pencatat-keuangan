import { Box, Button, CardBody, CardHeader, Heading, Input, Stack, StackDivider, Text, VStack, Card, useToast, HStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store/Store'
import { Detail, addDetail, deleteDetail, getDetail } from '../redux/feature/detail'
import { editList, getList } from '../redux/feature/main'
import { formatRupiah } from '../lib/Formatter'
import dayjs from 'dayjs'
import { DetailCard } from '../components/DetailCard'


export const Detailpage = () => {
    const toast = useToast()

    const [search] = useSearchParams()
    const [newDetail, setNewDetail] = useState<Detail>()

    const list = useSelector((state: RootState) => state.detail)
    const listParent = useSelector((state: RootState) => state.mainList.filter((x) => x.id === search.get('id'))[0])
    const dispatch = useDispatch()

    const submit = () => {

        if(!newDetail?.title || !newDetail?.amount){
            toast({
                title: 'Title atau Bugdet Belum Di isi',
                position: 'top-right',
                isClosable: true,
                duration: 1000,
                colorScheme: "red",
              })
              return
        }

        dispatch(addDetail({ ...newDetail, id: search.get('id') || '', createdAt: dayjs(new Date).format("DD MMMM YYYY, HH mm") }))
        dispatch(editList({...listParent, currentAmount: listParent.currentAmount! +  newDetail.amount}))
        dispatch(getDetail({ id: search.get('id') || "" }))
        setNewDetail({...newDetail, title: "", amount: 0})
        dispatch(getList())
    }

    useEffect(() => {
        dispatch(getDetail({ id: search.get('id') || "" }))
        dispatch(getList())
    }, [dispatch, search])

    const deletePengeluaran = (item: Detail) => {
        console.log("oke")
        console.log(item)
        dispatch(editList({...listParent, currentAmount: listParent.currentAmount! - item.amount! }))
        dispatch(deleteDetail(item))
        dispatch(getList())
        dispatch(getDetail({ id: search.get('id') || "" }))

    }

    return (
        <VStack>
            <Text width="full" textAlign="left">Nama</Text>
            <Input value={newDetail?.title} onChange={(v) => setNewDetail({ ...newDetail, title: v.target.value })} />
            <Text  width="full" textAlign="left">Bugdet</Text>
            <Input value={newDetail?.amount} onChange={(v) => setNewDetail({ ...newDetail, amount: isNaN(Number(v.target.value)) ? 0 : parseInt(v.target.value) })} />
            <HStack width="full" justifyContent="space-between">
            <Button fontSize={{'sm': 'md'}} colorScheme="red" onClick={() => history.back()}>Kembali</Button>
            <Button fontSize={{'sm': 'md'}} colorScheme="blue" onClick={submit}>Submit</Button>
            </HStack>
            <VStack>


            </VStack>

            <Card width="full" textAlign="left" variant="elevated">
                <CardHeader>
                    <Heading size={{'sm': 'md', 'lg': 'md'}}>Total keseluruhan: {formatRupiah(listParent?.currentAmount || 0)}</Heading>
                    <Heading size={{'sm': 'md', 'lg': 'md'}}>Limit: {formatRupiah(listParent?.limit || 0)}</Heading>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        {
                        list?.map((item, index) => (
                              <DetailCard handleClick={deletePengeluaran} item={{...item, index}} key={index} />
                            ))
                        }

                    </Stack>
                </CardBody>
            </Card>
        </VStack>
    )
}
