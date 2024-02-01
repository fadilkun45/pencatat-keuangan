/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { useState } from "react"
import { HamburgerIcon, QuestionIcon } from "@chakra-ui/icons"
import { Box, HStack, Spacer, Text, VStack } from "@chakra-ui/react"
import ModalNav from "./ModalNav"
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const Navbar = () => {

  const [showDrawer, setShowDrawer] = useState(false)


  const handleTutorial = () => {

    let driverStepList: any


    if(location.pathname.includes("detail")){
       driverStepList = driver({
        showProgress: true,
      
        steps: [
          { popover: {title: "Bagaimana cara memakai aplikasi ini ? part 2", description: "step by step pembuatan grup dan penambahan isi detail grup tersebut"}},
          { element: '.name-input', popover: { title: 'Masukan nama', description: 'nama wajib di masukkan contoh makanan, minuman atau apapun itu' } },
          { element: '.price-input',popover: { title: 'Masukan Harga', description: 'harga wajib di masukkan juga untuk pencatatan' } },
          { element: '.create-button', popover: { title: 'tambah catatan', description: 'Bila dirasa sudah sesuai langsung klik submit maka akan tercipta catatan baru dibawah' } },
          { element: '.info', popover: { title: 'Info keseluruhan', description: 'seluruh catatan yang kalian buat akan terakumulasi dibagian sini termaksud limit nya juga bila kalian isi diawal tadi' } },
          { element: '.menu', popover: { title: 'Tambahan', description: 'oiya sebelum penutup tutorial untuk fitur lain nya bisa di klik dibagian sini, seperti download dan simpan data, dan juga install aplikasi ini agar bisa berjalan secara offline' } },
          { popover: { title: 'Have fun ^~^', description: 'semoga tutorial singkat ini dapat membantu kalian dalam menggunakan nya' } },
  
          // { element: '.footer', popover: { title: 'Title', description: 'Description' } },
        ]
      });
  
    }else{
       driverStepList = driver({
        showProgress: true,
      
        steps: [
          { popover: {title: "Bagaimana cara memakai aplikasi ini ?", description: "step by step pembuatan grup dan penambahan detail grup tersebut"}},
          { element: '.name-input', popover: { title: 'Masukan nama', description: 'nama wajib di masukkan dan bila bingung isi apa bisa checklist untuk menggunakan penamaan tgl berdasarkan waktu pembuatan' } },
          { element: '.limit-input',popover: { title: 'Masukan limit', description: 'untuk limit ini opsional namun akan sangat berguna untuk sebagai pengingat apakah sudah melebihi batas yang ditentukan atau belom' } },
          { element: '.create-btn', popover: { title: 'Buat grup', description: 'Bila dirasa sudah sesuai langsung klik submit maka akan tercipta grup baru dibawah' } },
          { popover: { title: 'Lanjut part 2', description: 'selanjutnya silahkan klik grup yang baru dibuat untuk lanjut tutorial berikut nya' } },
  
          // { element: '.footer', popover: { title: 'Title', description: 'Description' } },
        ]
      });
  
    }
    
    driverStepList.drive();
  } 




  return (
    <>
      <ModalNav hideModal={() => setShowDrawer(!showDrawer)} show={showDrawer} />

      <HStack marginBottom="16">
        <Text fontWeight="bold" fontSize="xl">Pencatat Keuangan</Text>
        <Spacer />
      
        <HStack>
        <Box mr="5px" onClick={() => handleTutorial()}>
            <QuestionIcon  w={"20px"} h={"20px"}/>
          </Box>

          <Box className="menu" onClick={() => setShowDrawer(true)}>
            <HamburgerIcon  w={"20px"} h={"20px"}/>
          </Box>
         
        </HStack>
      </HStack>
    </>
  )
}
