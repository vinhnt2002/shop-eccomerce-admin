"use client";

import { Copy, Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import {  useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { CollectionColumn } from "./columns";

interface CellActionProps {
  data: CollectionColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
// console.log(data);

  const onConfirm = async () => {
    console.log("test submit");
    
    try {
      setLoading(true);
    
      await fetch(`/api/collections/${data.id}`,{
        method:"DELETE"
      })
      toast.success('xóa bộ sưu tập thành công.');
      router.refresh();
    } catch (error) {
      toast.error('Đã có lỗi.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Product ID copied to clipboard.');
  }

    // Function to handle the "Add to Collection" action
    const onAddToCollection = () => {
      // Implement the logic to add the product to a collection here
      // You can use a modal or a dropdown to select the target collection
      toast.success('Product added to collection.');
    }

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCopy(data.id)}
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/collections/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" /> Xóa
          </DropdownMenuItem>
           {/* Add the "Add to Collection" option */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};