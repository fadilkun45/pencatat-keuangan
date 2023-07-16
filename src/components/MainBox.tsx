import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Input, Text, VStack } from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import { MainList } from '../redux/feature/main'
import { useNavigate } from "react-router-dom"
import { formatRupiah } from "../lib/Formatter"

export const MainBox = ({ item, handleClick }: { item: MainList, handleClick: (params: any) => any }) => {
    const navigate = useNavigate()

    return (
        <Card  variant="elevated" width="full" textAlign="left">
            <CardHeader>
                <Heading fontSize={{'sm': 'lg'}}>{item.title}</Heading>
            </CardHeader>
            <CardBody cursor="pointer" onClick={() => navigate(`/detail?id=${item.id || ''}`)} marginTop="-10">
                <Text fontSize={{'sm': 'lg'}}>Total : {formatRupiah(item.currentAmount || 0)}</Text>
                <Text fontSize={{'sm': 'lg'}}>Limit : {formatRupiah(item.limit || 0)}</Text>
                <Text>{formatRupiah(item.currentAmount || 0)} dari {formatRupiah(item.limit || 0)}</Text>
            </CardBody>
            <CardFooter marginTop="-5">
            <Button onClick={() => {handleClick(item)}} zIndex={6} width="full" position="relative"><DeleteIcon   /></Button>
            </CardFooter>
        </Card>
    )
}
