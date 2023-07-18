'use client'

import { useRouter } from "next/navigation";
import { CollectionColumn ,columns} from "./columns";
import { useAlertModal } from "@/hooks/useAlertModal";
import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { toast } from "react-hot-toast";


interface CollectionsClientProps {
  data: CollectionColumn[];
}
const CollectionsClient: React.FC<CollectionsClientProps> = ({
  data
}) => {
  console.log(data);
  
  const router = useRouter();
  const alertModal = useAlertModal()
  const [showDeleteButton, setShowDeleteButton]= useState(false)

  const [loading,setLoading] = useState(false)

  const onDelete = async (ids:string[]) => {
    console.log("test delete");
    
    // try {
    //   setLoading(true);
    //   await fetch(`/api/collecitons`, {
    //     method: "DELETE",
    //     body: JSON.stringify(ids),
    //   });
    //   router.refresh();
    //   router.push(`/collections`);
    //   toast.success('Xóa thành công.');
    // } catch (error: any) {
    //   toast.error('Đã có lỗi.');
    // } finally {
    //   setLoading(false);
    //   alertModal.onClose()
     
    // }
  };

  return (
    // <div>Wait for creating for api collecitons</div>
    <> 
    <div className="flex items-center justify-between">
      <Heading title={`Bộ sưu tập: ${data.length}`} description="Quản lí Bộ sưu tập" />
      <Button onClick={() => router.push(`/collections/new`)}>
        <Plus className="mr-2 h-4 w-4" /> Thêm mới
      </Button>
    </div>
    <Separator />
    <DataTable searchKey="name" columns={columns} data={data} onDelete={onDelete} loading={loading} showDeleteButton={!showDeleteButton}/>
    <Heading title="API" description="API của Collections" />
    <Separator />
    <ApiList entityName="collection" entityIdName="collectionId" />
    </>
  )
};

export default CollectionsClient;
