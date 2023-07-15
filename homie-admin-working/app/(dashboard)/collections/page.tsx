import CollectionsClient from "./components/CollectionsClient";

const CollectionPage = () => {
  
    
    
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* <ProductsClient data={formattedProducts} /> */}
        <CollectionsClient />
      </div>
    </div>
  );
};

export default CollectionPage;
