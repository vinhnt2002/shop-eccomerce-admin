import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');


  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || '',
      },
      include: {
        orderItems: true,
      }
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true
      }
    });
  }

  return new NextResponse(null, { status: 200 });
};


// import { CheckoutNodeSDK } from "@paypal/checkout-server-sdk";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

// import prismadb from "@/lib/prismadb";

// export async function POST(req: Request) {
//   const body = await req.text();
//   const signature = headers().get("PayPal-Signature") as string; // Replace "PayPal-Signature" with the actual header used by PayPal to send the signature.

//   let event: PayPal.Event;

//   try {
//     // Replace "process.env.PAYPAL_WEBHOOK_SECRET" with your actual PayPal webhook secret.
//     event = await validatePayPalWebhookEvent(body, signature, process.env.PAYPAL_WEBHOOK_SECRET!);
//   } catch (error: any) {
//     return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
//   }

//   if (event.event_type === "CHECKOUT.ORDER.COMPLETED") {
//     const order = await prismadb.order.update({
//       where: {
//         paypalOrderId: event.resource.id, // Assuming you store the PayPal order ID in your database upon creation.
//       },
//       data: {
//         isPaid: true,
//         address: getAddressString(event.resource.purchase_units[0]?.shipping?.address),
//         phone: event.resource.purchase_units[0]?.shipping?.phone?.national_number || "",
//       },
//       include: {
//         orderItems: true,
//       },
//     });

//     const productIds = order.orderItems.map((orderItem) => orderItem.productId);

//     await prismadb.product.updateMany({
//       where: {
//         id: {
//           in: [...productIds],
//         },
//       },
//       data: {
//         isArchived: true,
//       },
//     });
//   }

//   return new NextResponse(null, { status: 200 });
// }

// // Function to validate PayPal webhook event signature
// async function validatePayPalWebhookEvent(
//   body: string,
//   signature: string,
//   webhookSecret: string
// ): Promise<PayPal.Event> {
//   const payPalEnvironment = new CheckoutNodeSDK.ClientEnvironment();
//   const payPalClient = new CheckoutNodeSDK.Core(payPalEnvironment);

//   const webhookEvent = new CheckoutNodeSDK.webhooks.WebhookEvent();

//   webhookEvent.headers["PayPal-Signature"] = signature;
//   webhookEvent.body = body;
//   webhookEvent.authAlgo = "SHA256withRSA";
//   webhookEvent.transmissionId = "TRANSMISSION_ID";

//   const request = new CheckoutNodeSDK.webhooks.WebhookEventVerifyRequest();
//   request.requestBody(webhookEvent);

//   try {
//     const response = await payPalClient.execute(request);

//     if (response.result.verification_status === "SUCCESS") {
//       return response.result;
//     } else {
//       throw new Error("Webhook signature verification failed");
//     }
//   } catch (error) {
//     throw new Error("Webhook signature verification failed");
//   }
// }

// // Function to construct the address string
// function getAddressString(address: PayPal.Address | undefined): string {
//   if (!address) return "";

//   const addressComponents = [
//     address.line1,
//     address.line2,
//     address.city,
//     address.state,
//     address.postal_code,
//     address.country_code,
//   ];

//   return addressComponents.filter((c) => c !== undefined).join(", ");
// }
