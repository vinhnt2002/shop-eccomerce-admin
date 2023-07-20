"use client"

import Image from "next/image"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { SizeColumn } from "@/app/(dashboard)/sizes/components/columns";

export const columns: ColumnDef<SizeColumn>[] = [
  {
    id: "Chọn",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row,table }) => (
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
  // {
  //   accessorKey: "image",
  //   header: "Ảnh sản phẩm",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-x-2">
  //      <Image className="rounded-full" src={row.original.images[0].url} alt="image" height={50} width={50}/>
  //     </div>
  //   )
  // },
  {
    accessorKey: "price",
    header: "Giá",
  },

];