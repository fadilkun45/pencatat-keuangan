

import { useState, useEffect, useLayoutEffect } from "react"
import { DownloadIcon } from "@chakra-ui/icons"
import { HStack, Spacer, Text, VStack, useToast } from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { addList, getList } from "../redux/feature/main"
import dayjs from "dayjs"
import ModalInputData from "./ModalInputData"
import { RootState } from "../redux/store/Store"
import { addDetail } from "../redux/feature/detail"

export const Navbar = () => {
  const toast = useToast()
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>();
  const [PwaInstalled, setPwaInstalled] = useState(false)
  const list = useSelector((state: RootState) => state.mainList)
  const [modalInputData, setModalInputData] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const handler = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
  }, []);


  const onClick = (evt: { preventDefault: () => void; }) => {
    evt.preventDefault();

    if (!supportsPWA) {
      toast({
        title: 'Upss Device Mu tak support PWA',
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

  const handleDownloadData = () => {
    // console.log(JSON.parse(localStorage.getItem("MainList") || "{}"))

    let data: any = []

    list.map((item) => {
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

const handleInputData = async (_file: any) => {
  dispatch(getList())
  const parsedData: any = await readJsonFile(_file)
  console.log(parsedData)

  parsedData?.map((item: any) => {


  if(list.filter((x) => x.id == item.parent.id).length !== 0){
    return
  }else{
    dispatch(addList({...item.parent}))
    console.log(item)

    if(item.child.length !== 0){
      localStorage.setItem(item.child[0].id, JSON.stringify(item.child))
    }
    dispatch(getList())
  }

    

  })



}



  return (
    <>

    <ModalInputData file={handleInputData} show={modalInputData} hideModal={() => setModalInputData(!modalInputData)}/>
    
    <HStack marginBottom="16">
      <Text fontWeight="bold" fontSize="xl">Pencatat Keuangan</Text>
      <Spacer />
      {
        supportsPWA ?  <VStack onClick={onClick} >
        <DownloadIcon boxSize={3} />
        <Text fontSize="xs">Install App</Text>
      </VStack> : ""
      }
      <VStack>
      <VStack onClick={handleDownloadData} >
        <DownloadIcon boxSize={3} />
        <Text fontSize="xs">Download Data</Text>
      </VStack>
      <VStack mt="3" onClick={() => setModalInputData(true)} >
        <DownloadIcon boxSize={3} />
        <Text fontSize="xs">Insert Data</Text>
      </VStack>
      </VStack>
    </HStack>
    </>
  )
}
