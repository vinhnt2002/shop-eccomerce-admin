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
        collections: true,
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

    const {
      name,
      categoryId,
      images,
      url,
      sizes,
      sizeId,
      description,
      code,
      collections,
    } = body;

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
        // collections: {
        //   createMany : {
        //     data: [...collections.map((collection: {collectionId: string}) => collection)]
        //   }
        // },

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

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse("Valid IDs array is required", { status: 400 });
    }

    // Step 1: Find the products to be deleted and include their associated images
    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        images: true,
      },
    });

    // Step 2: Delete images ở bên table Image nhá.   Vì 2 thằng có rằng buộc về key
    for (const product of products) {
      if (product.images.length > 0) {
        const imageIds = product.images.map((image) => image.id);
        await prismadb.image.deleteMany({
          where: {
            id: {
              in: imageIds,
            },
          },
        });
      }
    }

    // Step 3: Delete the products after their associated images have been deleted
    await prismadb.product.deleteMany({
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
