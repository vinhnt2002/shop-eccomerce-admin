import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  try {
    if (!params.collectionId) {
      return new NextResponse("collection id is required", { status: 404 });
    }

    const collection = await prismadb.collection.findUnique({
      where: {
        id: params.collectionId,
      },
      include: {
        products: true,
      },
    });

    // if (!collection) {
    //     return new NextResponse("Collection not found", { status: 404 });
    //   }
  
    //   const productIds = collection.products.map((product) => product.id);
  
    //   const products = await prismadb.product.findMany({
    //     where: {
    //       id: {
    //         in: productIds,
    //       },
    //     },
    //   });
  
    //   // Include the associated products in the collection object
    //   collection.products = products;

    return NextResponse.json(collection);
  } catch (error) {
    console.log("[CollectionID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.collectionId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    // step 1 :findUnique the collection to delete
    const collection = await prismadb.collection.findUnique({
      where: {
        id: params.collectionId,
      },
      include: {
        products: true,
      },
    });
    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

     // Step 2: Delete the collection along with its associated products
     await prismadb.collection.delete({
      where: {
        id: params.collectionId,
      },
      include: {
        products: true,
      },
    });

    

    return NextResponse.json(collection);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

