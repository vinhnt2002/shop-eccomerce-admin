"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Collection, CollectionProduct, Product } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { SelectProductTable } from "./select-products-data-table";
import { columns as SelectProductColumns } from "./products-column";
import { ProductColumn } from "@/app/(dashboard)/products/components/columns";

const formSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  productIds: z.string().array(),
});

type CollectionFormValues = z.infer<typeof formSchema>;

interface CollectionFormProps {
  initialData: (Collection & { products: CollectionProduct[] }) | null;
  products: ProductColumn[];
}

const CollectionForm: React.FC<CollectionFormProps> = ({
  initialData,
  products,
}) => {
  const params = useParams();
  const router = useRouter();
  // console.log(initialData);
  // console.log(products);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Chỉnh sửa bộ sưu tập" : "Tạo bộ sưu tập";
  const description = initialData
    ? "Chỉnh sửa một bộ sưu tập"
    : "Thêm một bộ sưu tập mới";
  const toastMessage = initialData
    ? "Bộ sưu tập cập nhật thành công."
    : "Bộ sưu tập được tạo thành công .";
  const action = initialData ? "Lưu thay đổi" : "Tạo";

  const defaultValues = initialData
    ? {
        ...initialData,
        //spread object
        productIds: initialData.products.map((product) => {
          return product.productId;
        }),
      }
    : {
        productIds: [],
        name: "",
        code: "",
      };

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: CollectionFormValues) => {
    // console.log("test submit");
    try {
      if (!initialData) {
        // await axios.patch(`/api/collections/${params.collectionId}`, data);
        await axios.post(`/api/collections`, data);

      } 
      // else {
      //   await axios.post(`/api/collections`, data);
      // }
      router.refresh();
      router.push(`/collections`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Đã có lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    console.log("tét");
    
    // if (initialData)
    //   try {
    //     setLoading(true);
    //     await axios.delete(`/api/collections/${params.collectionId}`, {
    //       method: "DELETE",
    //     });
    //     router.refresh();
    //     router.push(`/collections`);
    //     toast.success("Xóa bộ sưu tập thành công.");
    //   } catch (error: any) {
    //     toast.error("Đã có lỗi.");
    //   } finally {
    //     setLoading(false);
    //     setOpen(false);
    //   }
    // else return;
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên bộ sưu tập</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="vd : phụ kiện (viết thường tất cả)"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="vd : phu-kien"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="productIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn sản phẩm </FormLabel>
                <SelectProductTable
                  onValueChange={field.onChange}
                  data={products}
                  columns={SelectProductColumns}
                  searchKey="name"
                  initialData={initialData?.products.map(
                    (product) => product.productId
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CollectionForm;
