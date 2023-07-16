import { Button, Input, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/store/Store'
import { Detail, addDetail, getDetail } from '../redux/feature/detail'
import { v4 as uuidv4 } from 'uuid';


export const Detailpage = () => {

    const [search] = useSearchParams()
    const [newDetail, setNewDetail] = useState<Detail>()

    const list = useSelector((state: RootState) => state.detail)
    const dispatch = useDispatch()

    const submit = () => {
        dispatch(addDetail({ ...newDetail, id: search.get('id') || '', }))
    }

    useLayoutEffect(() => {
        if(!search.get('id')) return
        dispatch(getDetail({id: search.get('id') || ''}))
    },[])





  return (
    <VStack>
            <div>id: {search.get('id')}</div>

         <Text>Nama</Text>
            <Input onChange={(v) => setNewDetail({ ...newDetail, title: v.target.value })} />
            <Text>Max Bugdet</Text>
            <Input onChange={(v) => setNewDetail({ ...newDetail, amount: parseInt(v.target.value) })} />
            <Button onClick={submit}>Submit</Button>

            <VStack>
                {
                    list.map((res) => (
                        <Text>{res.title}</Text>
                    ))
                }
            </VStack>
    </VStack>
  )
}
