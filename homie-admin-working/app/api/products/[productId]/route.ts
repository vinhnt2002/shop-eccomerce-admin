import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        sizes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    // need to delete image before
    await prismadb.image.deleteMany({
      where: {
        productId: params.productId,
      },
    });

    // Delete the product
    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// export async function PATCH(
//   req: Request,
//   { params }: { params: { productId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     const body = await req.json();

//     const {
//       name,
//       code,
//       description,
//       categoryId,
//       sizeId,
//       images

//     } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!params.productId) {
//       return new NextResponse("Product id is required", { status: 400 });
//     }

//     if (!name) {
//       return new NextResponse("Name is required", { status: 400 });
//     }

//     if (!categoryId) {
//       return new NextResponse("Category id is required", { status: 400 });
//     }

//     if (!images || !images.length) {
//       return new NextResponse("Images are required", { status: 400 });
//     }

//     if (!sizeId) {
//       return new NextResponse("Size id is required", { status: 400 });
//     }

//     if (!code) {
//       return new NextResponse("Code are required", { status: 400 });
//     }

//     if (!description) {
//       return new NextResponse("Description is required", { status: 400 });
//     }

//     //First : find the product with image category and sizes
//     const product = await prismadb.product.findUnique({
//       where:{
//         id : params.productId,
//       },
//       include:{
//         images: true,
//         category:true,
//         sizes: true
//       }
//     })

//     if(!product){
//       return new NextResponse("Product not found", {status:404});
//     }

//      // Step 2: Delete the associated images for the product
//      const imageIds = product.images.map((image) => image.id);
//      if (imageIds.length > 0) {
//        await prismadb.image.deleteMany({
//          where: {
//            id: {
//              in: imageIds,
//            },
//          },
//        });
//      }

//       // Step 3: Update the product with the new data and create the new associated images
//     const updatedProduct = await prismadb.product.update({
//       where: {
//         id: params.productId,
//       },
//       data: {
//         name,
//         code,
//         description,
//         categoryId,
//         sizes: {
//           create: [{ size: { connect: { id: sizeId } }, price: 0 }],
//         },
//         images: {
//           createMany: {
//             data: images.map((image: { url: string }) => ({ url: image.url })),
//           },
//         },
//       },
//       include: {
//         images: true,
//       },
//     });

//     // await prismadb.product.update({
//     //   where: {
//     //     id: params.productId,
//     //   },
//     //   data: {
//     //     name,
//     //     code,
//     //     description,
//     //     categoryId,
//     //     images: {
//     //       deleteMany: {}
//     //     },
//     //     sizes: {
//     //       create: [{ size: { connect: { id: sizeId } }, price: 0 }],
//     //     },
//     //   },
//     // });

//     // const product = await prismadb.product.update({
//     //   where: {
//     //     id: params.productId
//     //   },
//     //   data: {
//     //     images: {
//     //       createMany: {
//     //         data: [
//     //           ...images.map((image: { url: string }) => image),
//     //         ],
//     //       },
//     //     },
//     //   },
//     // })

//     return NextResponse.json(updatedProduct);
//   } catch (error) {
//     console.log("[PRODUCT_PATCH]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, code,price, description, categoryId, sizeId, images } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!code) {
      return new NextResponse("Code is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,

        // sizeId: {},
        sizes: {
          deleteMany: {}, // Delete all existing sizes
        },
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        sizes: {
          create: [{ size: { connect: { id: sizeId } }, price: 0 }],
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
