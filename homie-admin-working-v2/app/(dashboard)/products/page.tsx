import React from "react";
import prismadb from "@/lib/prismadb";
import format from "date-fns/format";
import vi from "date-fns/locale/vi";

import { ProductsClient } from "./components/ProductClient";
import { ProductColumn } from "./components/columns";

const page = async () => {
  const products = await prismadb.product.findMany({
    where: {},
    include: {
      category: true,
      // toppings: {
      //   include: {
      //     topping: true,
      //   },
      // },
      sizes: {
        include: {
          size: true,
        },
      },
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    categoryId: item.categoryId,
    images: item.images,
    category: item.category,
    sizes: item.sizes.map((size) => {
      return size.size;
    }),
   
    // price: formatter.format(item.price.toNumber()),
    createdAt: format(item.createdAt, "do-M-yyyy", { locale: vi }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default page;
