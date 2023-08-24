import { Box, Button, Heading, Text, HStack } from '@chakra-ui/react'
import { Detail } from '../redux/feature/detail'
import { DeleteIcon } from "@chakra-ui/icons"
import { formatRupiah } from '../lib/Formatter'
import dayjs from 'dayjs'

export const DetailCard = ({item, handleClick}: {item: Detail, handleClick: (params: any) => any}) => {
  return (
    <Box >
    <Heading size={{'sm': "md"}}  textTransform='uppercase'>
        {item.title}
    </Heading>
    <Text pt='2' fontSize='sm'>
      Rp. {formatRupiah(item.amount || 0)}
    </Text>
    <Text pt='2' fontSize='sm'>
       {dayjs(item.createdAt).format("DD MMM YYYY, HH mm") }
    </Text>
    <HStack gap="9" mt="4">
    <Button onClick={() => {handleClick(item)}} zIndex={6} width="sm" position="relative"><DeleteIcon   /></Button>
    </HStack>
</Box>
  )
}
