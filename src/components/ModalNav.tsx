/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { AddIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, HStack, Spacer, Text, VStack, useToast } from '@chakra-ui/react'
import cloneDeep from 'lodash.clonedeep';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/Store';
import dayjs from 'dayjs';
import { addList, getList } from '../redux/feature/main';
import ModalInputData from './ModalInputData';


interface modalNavParams {
  hideModal: () => void;
  show: boolean
}

const ModalNav = ({ hideModal, show }: modalNavParams) => {
  const dispatch = useDispatch()
  const list = useSelector((state: RootState) => state.mainList)
  const [modalInputData, setModalInputData] = useState(false)
  const toast = useToast()
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>();


  useEffect(() => {
    const handler = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDownloadData = () => {
    let data: any = []

    const newData = cloneDeep(list)

    newData.reverse()

    newData.map((item) => {
      console.log(item)

      let child = JSON.parse(localStorage.getItem(item.id || "") || "[]")
      data.push({
        parent: item,
        child
      })
    })


    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data) || ""
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `pencatat-keuangan-archive:${dayjs().format("MM-YYYY-DD:HH:mm")}.json`;

    link.click();

  }

  const readJsonFile = (file: Blob) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.onload = event => {
        if (event.target) {
          resolve(JSON.parse(event.target.result as string))
        }
      }

      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)

    })

  const handleInputData = async (_file: Blob) => {
    dispatch(getList())

    const parsedData: any = await readJsonFile(_file)
    console.log(parsedData)

    parsedData?.map((item: any) => {


      if (list.filter((x) => x.id == item.parent.id).length !== 0) {
        return
      } else {
        dispatch(addList({ ...item.parent }))
        console.log(item)

        if (item.child.length !== 0) {
          localStorage.setItem(item.child[0].id, JSON.stringify(item.child))
        }
        dispatch(getList())
      }

    })

    setModalInputData(false)
    hideModal()

    toast({
      title: 'Upload data berhasil',
      position: 'top-right',
      isClosable: true,
      duration: 1000,
      colorScheme: "blue",
    })

  }

  const handleOnInstall = (evt: { preventDefault: () => void; }) => {
    evt.preventDefault();

    if (!supportsPWA) {
      toast({
        title: 'Upss device mu tidak support PWA',
        position: 'top-right',
        isClosable: true,
        duration: 1000,
        colorScheme: "yellow",
      })
    }

    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

const deleteAllData = () => {
  localStorage.clear()
  dispatch(getList())
  
  hideModal()

  toast({
    title: 'Upload data berhasil',
    position: 'top-right',
    isClosable: true,
    duration: 1000,
    colorScheme: "blue",
  })
}




  return (
    <>
     { modalInputData &&  <ModalInputData file={handleInputData} show={modalInputData} hideModal={() => setModalInputData(!modalInputData)} /> }

      <Drawer
        isOpen={show}
        placement='right'
        onClose={hideModal}
      >
        <DrawerOverlay />
        <DrawerContent h={"100dvh"}>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack>

              <HStack cursor="pointer" w="90%" onClick={handleDownloadData} >
                <DownloadIcon boxSize={4} />
                <Spacer />
                <Text fontSize="sm">Download Data</Text>
              </HStack>
              <Divider />

              <HStack cursor="pointer" w="90%" my="3" onClick={() => setModalInputData(true)} >
                <AddIcon boxSize={4} />
                <Spacer />
                <Text fontSize="sm">Insert Data</Text>
              </HStack>
              <Divider />

              <HStack cursor="pointer" w="90%" my="3" onClick={deleteAllData} >
                <DeleteIcon boxSize={4} />
                <Spacer />
                <Text fontSize="sm">Delete all data</Text>
              </HStack>
              <Divider />

              {
                supportsPWA ? <>
                  <HStack w="90%"  cursor="pointer"  my="3" onClick={handleOnInstall} >
                    <DownloadIcon boxSize={4} />
                    <Spacer />
                    <Text fontSize="sm">Install App</Text>
                  </HStack>
                  <Divider />
                </>
                  : ""
              }


              <Box h="30dvh" />
              <Text fontSize="xs">2024 &copy; Faldi Ramadhan, to my love elaina</Text>
            </VStack>
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ModalNav