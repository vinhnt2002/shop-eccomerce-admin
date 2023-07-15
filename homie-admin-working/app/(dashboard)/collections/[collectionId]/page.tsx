import prismadb from "@/lib/prismadb";
import CollectionForm from "./components/CollectionForm";

const CollectionPage = async ({params} : {params: {collectionId: string}}) => {
  
  const collection = await prismadb.collection.findUnique({
    where: {
      id: params.collectionId
    },
    // include: {
    //   products: true
    // }
  })

  const products = await prismadb.product.findMany({
    where: {},
    orderBy: {
      createdAt: "desc",
    },
  });
 
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CollectionForm
            initialData={collection}
            products = {products}
            />
        </div>
    </div>
  )
};

export default CollectionPage;
