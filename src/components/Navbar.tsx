

import { useState, useEffect, useLayoutEffect } from "react"
import { DownloadIcon } from "@chakra-ui/icons"
import { HStack, Spacer, Text, VStack, useToast } from "@chakra-ui/react"

export const Navbar = () => {
  const toast = useToast()
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>();
  const [PwaInstalled, setPwaInstalled] = useState(false)

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
        colorScheme: "red",
      })
    }

    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };

  useLayoutEffect( () => {
    const relatedApps = navigator.getInstalledRelatedApps();
    setPwaInstalled(relatedApps.length > 0)
  }, [])




  return (
    <HStack marginBottom="16">
      <Text fontWeight="bold" fontSize="xl">Pencatat Keuangan</Text>
      <Spacer />
      {
        !PwaInstalled ?   <VStack onClick={onClick} >
        <DownloadIcon boxSize={3} />
        <Text fontSize="xs">Install App</Text>
      </VStack> : ""
      }
    </HStack>
  )
}
