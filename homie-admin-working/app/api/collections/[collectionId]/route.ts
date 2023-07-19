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
        products: {
          include: {
            product: true,
          },
        },
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

    const body = await req.json();
    const productIds = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.collectionId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if(!productIds) {
      return new NextResponse("products id is required" , {status: 400})
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

    //  Step 2: Delete the collection along with its associated products
     await prismadb.collection.delete({
      where: {
        id: params.collectionId,
      },
      include: {
        products: true,
      },
    });

    // const collection = await prismadb.collectionProduct.deleteMany({
    //   where:{
    //     colle: {
    //       in: collectionId
    //     }
    //   }
    // })

    return NextResponse.json(collection);
  } catch (error) {
    console.log("[COLLECTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// export async function DELETE(
//   req: Request,
//   { params }: { params: { collectionId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!params.collectionId) {
//       return new NextResponse("Collection id is required", { status: 400 });
//     }

//     // Step 1: Find the collection to delete
//     const collection = await prismadb.collection.findUnique({
//       where: {
//         id: params.collectionId,
//       },
//       include: {
//         products: true,
//       },
//     });

//     if (!collection) {
//       return new NextResponse("Collection not found", { status: 404 });
//     }

//     //  ************   TỐI ƯU SAU CHỖ NÀY ********************
//     // Step 2: Delete associated products
//     for (const product of collection.products) {
//       await prismadb.product.delete({
//         where: {
//           id: product.productId,
//         },
//       });
//     }

//     // Step 3: Delete the collection
//     await prismadb.collection.delete({
//       where: {
//         id: params.collectionId,
//       },
//     });

//     return new NextResponse(
//       "Collection and associated products deleted successfully",
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("[COLLECTION_DELETE]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
