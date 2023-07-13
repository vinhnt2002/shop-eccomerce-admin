import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export const GET = async (req: Request) => {
  try {

    const products = await prismadb.product.findMany({
      include: {
        images: true,
        sizes: true,
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, categoryId, images, url, sizes, sizeId, description, code } =
      body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!name || !code || !description) {
      return new NextResponse("Input required", { status: 400 });
    }
    if (!images) {
      return new NextResponse("images is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("category id is required", { status: 400 });
    }

    // const codeRegex = /^[A-Za-z0-9-]+$/;
    // if (!code.match(codeRegex)) {
    //   return new NextResponse("Invalid code format" ,{status: 400})
    // }

    const product = await prismadb.product.create({
      data: {
        name,
        code,
        description,
        categoryId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },

        sizes: {
          // Assuming you have a relation field named `productSizes` in the `Product` model
          create: [{ size: { connect: { id: sizeId } }, price: 0 }],
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();

    const ids = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!ids) {
      return new NextResponse("ids is required", { status: 400 });
    }


    const products = await prismadb.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
