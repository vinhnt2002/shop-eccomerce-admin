'use client'

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";
import React, { useEffect } from "react";

const SetupPage = () => {

  // const storeModal = useStoreModal();
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() =>{
    if(!isOpen){
      onOpen()
    }
  }, [isOpen, onOpen])

  return <div className="p-4">
    <UserButton afterSignOutUrl="/"/>
    root page
    
  </div>;
};

export default SetupPage;
