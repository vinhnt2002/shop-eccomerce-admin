import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthoried", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is requried", { status: 401 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("SROTRES_POST", error);
    return new NextResponse("Internal Error ", { status: 500 });
  }
}
