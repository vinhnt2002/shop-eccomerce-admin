"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();


  const routes = [
    {
      href: `/`,
      label: 'Trang chủ',
      active: pathname === `/`,
    },
    {
      href: `/products`,
      label: 'Sản phẩm',
      active: pathname === `/products${params.productId ? `/${params.productId}`:""}`,
      // active: pathname === `/products`,
    },
    {
      href: `/collections`,
      label: 'Bộ sưu tập',
      active: pathname === `/collections${params.collectionId ? `/${params.collectionId}`:""}`,
      // active: pathname === `/collecitons`,
    },
    {
      href: `/categories`,
      label: 'Phân Loại',
      active: pathname ===`/categories${params.categoryId ? `/${params.categoryId}`:""}`
      // active: pathname === `/categories`,
    
    },
    {
      href: `/sizes`,
      label: 'Sizes',
      active: pathname === `/sizes${params.sizeId ? `/${params.sizeId}`:""}`,
      // active: pathname === `/siezs`,
      
    },
    {
      href: `/orders`,
      label: 'Đơn Hàng',
      active: pathname === `/orders`,
    },
    {
      href: `/settings`,
      label: 'Cài đặt',
      active: pathname === `/settings`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};