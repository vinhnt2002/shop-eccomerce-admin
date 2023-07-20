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
      return new NextResponse("Collection id is required", { status: 400 });
    }

    // Step 1: Find the collection to delete
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

    // delete nè
    await prismadb.collection.delete({
      where: {
        id: params.collectionId,
      },
    });

    return new NextResponse(
      "Collection and associated products deleted successfully",
      { status: 200 }
    );
  } catch (error) {
    console.log("[COLLECTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

      // wait to doing
export async function PATCH(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, code , products,productIds} = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.collectionId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!code) {
      return new NextResponse("Code is required", { status: 400 });
    }

    if(!productIds) {
      return new NextResponse("products id is required " , {status: 400})
    }

    await prismadb.collection.update({
      where: {
        id: params.collectionId,
      },
      data: {
        name,
        code,
        products:{
          deleteMany:{}
        }
      },
    });

    const collection = await prismadb.collection.update({
      where: {
        id: params.collectionId,
      },
      data: {
        products: {
          createMany : {
            data:productIds.map((id:string)=>{
              return {productId:id}
            })
          }
        }
      },
      include:{
        products:true
      }
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


