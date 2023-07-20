import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

import { formatter } from "@/lib/utils";
import format from "date-fns/format";
import vi from "date-fns/locale/vi";
import { SizeColumn } from "../../sizes/components/columns";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      category: true,
      // toppings: true,
      sizes: true,
      images: true,
    },
  });

  // const toppings = await prismadb.topping.findMany({
  //   where: {},
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  const sizes = await prismadb.size.findMany({
    where: {},
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prismadb.category.findMany({
    where: {},
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSize: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
   
    // price: formatter.format(item.price.toNumber()),
    createdAt: format(item.createdAt, "do-M-yyyy", { locale: vi }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          size2= {formattedSize}
          // toppings={toppings}
          categories={categories}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
