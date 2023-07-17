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

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
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

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100
      }
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId
            }
          }
        }))
      }
    }
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id
    },
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
};



// import paypal  from "@paypal/checkout-server-sdk";
// import { NextResponse } from "next/server";

// import prismadb from "@/lib/prismadb";



// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   const { productIds } = await req.json();

//   if (!productIds || productIds.length === 0) {
//     return new NextResponse("Product ids are required", { status: 400 });
//   }

//   const products = await prismadb.product.findMany({
//     where: {
//       id: {
//         in: productIds,
//       },
//     },
//   });

//   // Creating an environment
// let clientId = "<<PAYPAL-CLIENT-ID>>";
// let clientSecret = "<<PAYPAL-CLIENT-SECRET>>";

// let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// let client = new paypal.core.PayPalHttpClient(environment);

//   // const payPalClientId = process.env.PAYPAL_CLIENT_ID; // Replace this with your PayPal client ID
//   // const payPalEnvironment = new CheckoutNodeSDK.ClientEnvironment(payPalClientId);
//   // const payPalClient = new CheckoutNodeSDK.Core(payPalEnvironment); // Use sandboxEnvironment for testing

//   const orderCreateRequest = new paypal.orders.OrdersCreateRequest();

//   orderCreateRequest.headers["prefer"] = "return=representation";
//   orderCreateRequest.requestBody({
//     intent: "CAPTURE",
//     purchase_units: [
//       {
//         amount: {
//           currency_code: "USD",
//           value: calculateTotal(products).toString(),
//         },
//       },
//     ],
//     application_context: {
//       return_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
//       cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
//     },
//   });

//   let order;
//   try {
//     order = await payPalClient.execute(orderCreateRequest);
//   } catch (err) {
//     return new NextResponse("Error creating PayPal order", { status: 500 });
//   }

//   const approvalLink = order.result.links.find((link) => link.rel === "approve");
//   if (!approvalLink) {
//     return new NextResponse("Error creating PayPal order", { status: 500 });
//   }

//   const orderItems = productIds.map((productId: string) => ({
//     product: {
//       connect: {
//         id: productId,
//       },
//     },
//   }));

//   const orderData = {
//     storeId: params.storeId,
//     isPaid: false,
//     orderItems: {
//       create: orderItems,
//     },
//     paypalOrderId: order.result.id,
//   };

//   const createdOrder = await prismadb.order.create({ data: orderData });

//   return NextResponse.json({ url: approvalLink.href }, {
//     headers: corsHeaders,
//   });
// };

// function calculateTotal(products) {
//   let total = 0;
//   products.forEach((product) => {
//     total += product.price.toNumber();
//   });
//   return total.toFixed(2);
// }
