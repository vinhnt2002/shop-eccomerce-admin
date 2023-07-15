import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// backup version
export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, code,products } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // const productData = products.map((product: { productId: string }) => ({
    //   product: { connect: { id: product.productId } },
    // }));

    const collection = await prismadb.collection.create({
      data: {
        name,
        code,
        // products: {
        //   create: [{ product: { connect: { id: productId } } }],
        // },
        // products: {
        //   createMany : {
        //     data: [...products.map((product: {productId: string}) => product)]
        //   }
        // }
        // products: {
        //   createMany :{
        //     data: productData
        //   }
        // }
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.log("[COLLECTION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export const GET = async (req: Request) => {
  try {
    const collections = await prismadb.collection.findMany({
      include: {
        products:true
      }
    });
    return NextResponse.json(collections);
  } catch (error) {
    console.log("COLLECTION_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
