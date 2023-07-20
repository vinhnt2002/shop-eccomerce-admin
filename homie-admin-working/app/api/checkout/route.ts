import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  ///TEST

  // const orderItemsToUpdate: { id: string; quantity: number }[] = [];

  // products.forEach((product) => {
  //   const quantity = 1; // Assuming 1 quantity for each product for now

  //   line_items.push({
  //     quantity,
  //     price_data: {
  //       currency: 'VND',
  //       product_data: {
  //         name: product.name,
  //       },
  //       unit_amount: product.price.toNumber() * 100
  //     }
  //   });

  //   const orderItem = product.orderItems.find((item) => item.product.id === product.id);
  //   if (orderItem) {
  //     orderItemsToUpdate.push({ id: orderItem.id, quantity });
  //   }
  // });

  // const orderItemsUpdatePromises = orderItemsToUpdate.map(({ id, quantity }) => {
  //   return prismadb.orderItem.update({
  //     where: { id },
  //     data: { quantity }
  //   });
  // });

  // await Promise.all(orderItemsUpdatePromises);

  // const orderItemsToCreate = productIds.filter(productId => {
  //   return !orderItemsToUpdate.some(item => item.id === productId);
  // }).map(productId => ({
  //   product: { connect: { id: productId } },
  //   quantity: 1 // Assuming 1 quantity for each product for now
  // }));

  // const order = await prismadb.order.create({
  //   data: {
  //     isPaid: false,
  //     orderItems: {
  //       create: orderItemsToCreate
  //     }
  //   }
  // });

  // END TEST

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'VND',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber()
      }
    });
  });

  // const orderItems = productIds.map((productId: string) => ({
  //   product: {
  //     connect: {
  //       id: productId
  //     }
  //   },
  //   quantity: 1 
  // }));

  const order = await prismadb.order.create({
    data: {
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId
            }
          }
        }))
      },
      // orderItems: {
      //   create: orderItems
      // }
    }
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/checkout?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/checkout?canceled=1`,
    metadata: {
      orderId: order.id
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
};
