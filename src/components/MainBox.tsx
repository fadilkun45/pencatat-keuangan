import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Input, Text, VStack } from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import { MainList } from '../redux/feature/main'
import { useNavigate } from "react-router-dom"

export const MainBox = ({ item }: { item: MainList }) => {
    const navigate = useNavigate()

    return (
        <Card onClick={() => navigate(`/detail?id=${item.id || ''}`)} variant="elevated" width="full" textAlign="left">
            <CardHeader>
                <Heading>{item.title}</Heading>
            </CardHeader>
            <CardBody marginTop="-10">
                <Text>Total : {item.currentAmount}</Text>
                <Text>Limit : {item.limit}</Text>
                <Text>{item.currentAmount} dari {item.limit}</Text>
                <Button marginTop="10px"><DeleteIcon boxSize={6} /></Button>
            </CardBody>
        </Card>
    )
}
