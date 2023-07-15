"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  // name: z.string().min(1),
  // code: z.string().min(1),
});

type CollectionFormValues = z.infer<typeof formSchema>;

interface CollectionFormProps {
  // initialData: Collection | null;
  initialData: "";
  code: "";
  name: "";
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

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
        //  ...initialData
        //spread object
      }
    : {
        name: "",
        code: "",
      };

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (data: CollectionFormValues) => {
    console.log("test submit");
  };

  const onDelete = () => {
    console.log("Test delete");
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
            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phân loại</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="vd : gấu bông (viết thường tất cả)"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
{/* 
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="vd : gau-bong"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CollectionForm;
