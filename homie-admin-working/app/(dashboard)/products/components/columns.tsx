"use client";

import Image from "next/image";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";

import { Image as PrismaImage, Category, Size } from "@prisma/client";

export type ProductColumn = {
  id: string;
  name: string;
  code: string;
  price: string;
  category: Category;
  categoryId: string;
  images: PrismaImage[];
  sizes: Size[];
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    id: "Chọn",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "code",
    header: "Mã sản phẩm",
  },
  {
    accessorKey: "image",
    header: "Ảnh sản phẩm",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2 ">
        {row.original.images.length > 0 && (
          <Image
            src={row.original.images[0].url}
            alt="image"
            height={50}
            width={50}
            className="rounded-full"
          />
        )}
        <span>({row.original.images.length})</span>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Giá tiền",
  },
  {
    accessorKey: "category",
    header: "Mã phân loại",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.category.name}
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: "Size khả dụng",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.sizes.map((size) => {
          return size.name;
        })}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
