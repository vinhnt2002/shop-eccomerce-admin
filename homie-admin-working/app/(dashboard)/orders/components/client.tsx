"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./columns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlertModal } from "@/hooks/useAlertModal";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {
    const router = useRouter();
    const alertModal = useAlertModal()
    const [loading,setLoading] = useState(false)
    const [showDeleteButton, setShowDeleteButton]= useState(false)
  const onDelete = async (ids:string[]) => {
   console.log("test");
    // try {
    //   setLoading(true);
    //   await fetch(`/api/categories`, {
    //     method: "DELETE",
    //     body: JSON.stringify(ids),
    //   });
    //   router.refresh();
    //   router.push(`/categories`);
    //   toast.success('Xóa thành công.');
    // } catch (error: any) {
    //   toast.error('Đã có lỗi.');
    // } finally {
    //   setLoading(false);
    //   alertModal.onClose()
     
    // }
  };
  return (
    <>
      <Heading title={`Đơn hàng (${data.length})`} description="Quản lý đơn hàng" />
      <Separator />
      <DataTable searchKey="products" loading={!loading} onDelete={onDelete} columns={columns} data={data} showDeleteButton={showDeleteButton} />
    </>
  );
};
