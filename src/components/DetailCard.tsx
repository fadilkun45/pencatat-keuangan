import { Box, Button, CardBody, CardHeader, Heading, Text, VStack, Card, useToast, HStack } from '@chakra-ui/react'
import { Detail } from '../redux/feature/detail'
import { DeleteIcon } from "@chakra-ui/icons"

export const DetailCard = ({item, handleClick}: {item: Detail, handleClick: (params: any) => any}) => {
  return (
    <Box >
    <Heading size={{'sm': "md"}}  textTransform='uppercase'>
        {item.title}
    </Heading>
    <Text pt='2' fontSize='sm'>
       {item.amount}
    </Text>
    <Text pt='2' fontSize='sm'>
       {item.createdAt}
    </Text>
    <Button onClick={() => {handleClick(item)}} zIndex={6} width="full" position="relative"><DeleteIcon   /></Button>
</Box>
  )
}
