import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { useState } from 'react'

const ModalInputData = ({show,hideModal,file}: {show: boolean, hideModal: () => void, file: (params: any) => void}) => {
    const [jsonFile, setJsonFile] = useState<any>(null)
  return (
    <Modal isOpen={show} onClose={hideModal}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Pilih File data</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input type='file' onChange={(v) => setJsonFile(v.target.files[0])} />
      </ModalBody>

      <ModalFooter>
      <Button colorScheme='gray' mr={3} onClick={hideModal}>
          Tutup
        </Button>
        <Button colorScheme='blue' onClick={() => file(jsonFile)} mr={3} >
          Simpan
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default ModalInputData