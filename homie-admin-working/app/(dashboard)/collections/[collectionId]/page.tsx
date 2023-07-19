import prismadb from "@/lib/prismadb";
import CollectionForm from "./components/CollectionForm";
import { ProductColumn } from "../../products/components/columns";
import { formatter } from "@/lib/utils";
import format from "date-fns/format";
import vi from "date-fns/locale/vi";



const CollectionPage = async ({params} : {params: {collectionId: string}}) => {
  
  const collection = await prismadb.collection.findUnique({
    where: {
      id: params.collectionId
    },
    include: {
      products: true
    }
  })

  const products = await prismadb.product.findMany({
    where: {},
    include: {
      category: true,
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
    price: formatter.format(item.price.toNumber()),
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
            <CollectionForm
            initialData={collection}
            products = {formattedProducts}
            />
        </div>
    </div>
  )
};

export default CollectionPage;
