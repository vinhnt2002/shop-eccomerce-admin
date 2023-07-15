import prismadb from "@/lib/prismadb";
import format from "date-fns/format";
import vi from "date-fns/locale/vi";

import CollectionsClient from "./components/CollectionsClient";
import { CollectionColumn } from "./components/columns";

const CollectionPage = async () => {
  const collections = await prismadb.collection.findMany({
    where: {},
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCollections: CollectionColumn[] = collections.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    products: item.products.map((productItem) => ({
      id: productItem.product.id,
      name: productItem.product.name,
      code: productItem.product.code,
      description: productItem.product.description,
    })),
    createdAt: format(item.createdAt, "do-M-yyyy", { locale: vi }),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* <ProductsClient data={formattedProducts} /> */}
        <CollectionsClient data={formattedCollections}/>
      </div>
    </div>
  );
};

export default CollectionPage;
