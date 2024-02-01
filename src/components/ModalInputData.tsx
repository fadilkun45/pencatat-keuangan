import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Toast, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'

const ModalInputData = ({show,hideModal,file}: {show: boolean, hideModal: () => void, file: (params: any) => void}) => {
  const toast = useToast()
    const [jsonFile, setJsonFile] = useState<any>(null)


    const handleValidateInputFile = (v: React.ChangeEvent<HTMLInputElement>) => {


      if(v.target.files[0].type !== "application/json"){
        toast({
          title: 'Data bukan json',
          position: 'top-right',
          isClosable: true,
          duration: 1000,
          colorScheme: "yellow",
        })
        setJsonFile(null)
        return
      }

      setJsonFile(v.target.files[0])
    }
  return (
    <Modal isOpen={show} onClose={hideModal}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Pilih File data</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input type='file' onChange={(v) => handleValidateInputFile(v)} />
      </ModalBody>

      <ModalFooter>
      <Button colorScheme='gray' mr={3} onClick={hideModal}>
          Tutup
        </Button>
        <Button colorScheme='blue' onClick={() => file(jsonFile)} isDisabled={jsonFile ? false : true} mr={3} >
          Simpan
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default ModalInputData