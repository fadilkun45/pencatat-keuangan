import { Button, Card, CardBody, CardFooter, CardHeader, HStack, Heading, Input, Spacer, Text, VStack } from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import { MainList } from '../redux/feature/main'
import { useNavigate } from "react-router-dom"
import { formatRupiah } from "../lib/Formatter"

export const MainBox = ({ item, handleClick }: { item: MainList, handleClick: (params: any) => any }) => {
    const navigate = useNavigate()

    return (
        <Card variant="elevated" width="full" textAlign="left">
            <CardHeader>
                <Heading fontSize={{ 'sm': 'lg' }}>{item.title}</Heading>
            </CardHeader>
            <CardBody cursor="pointer" onClick={() => navigate(`/detail?id=${item.id || ''}`)} marginTop="-10">
                <Text fontSize={{ 'sm': 'lg' }}>Total : Rp. {formatRupiah(item.currentAmount || 0)}</Text>
                <Text display={item.limit === 0 ? "none" : ""} fontSize={{ 'sm': 'lg' }}>Limit : Rp. {formatRupiah(item.limit || 0)}</Text>
                    {/* <Text>{dayjs(item.createdAt).format("DD MMM YYYY")}</Text> */}
                    <Text display={item.limit === 0 ? "none" : ""}  color={
                        parseInt(((item.currentAmount! / item.limit!) * 100).toFixed(2)) < 30 ? "green.500"
                            : parseInt(((item.currentAmount! / item.limit!) * 100).toFixed(2)) < 80 ? "yellow.500"
                                : parseInt(((item.currentAmount! / item.limit!) * 100).toFixed(2)) < 100 ? "red.500"
                                    : "red.500"}
                                     >{formatRupiah(item.currentAmount || 0)} dari Rp.{formatRupiah(item.limit || 0)} | Rp.{((item.currentAmount! / item.limit!) * 100).toFixed(2)} %</Text>
            </CardBody>
            <CardFooter marginTop="-5">
                <Button onClick={() => { handleClick(item) }} zIndex={6} width="full" position="relative"><DeleteIcon /></Button>
            </CardFooter>
        </Card>
    )
}
