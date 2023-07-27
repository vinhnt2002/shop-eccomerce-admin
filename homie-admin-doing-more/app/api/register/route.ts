import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { username, email, password } = body;

    // check
    if (!username) {
      return new NextResponse("username is requried", { status: 404 });
    }
    if (!email) {
      return new NextResponse("email is requried", { status: 404 });
    }
    if (!password) {
      return new NextResponse("password is requried", { status: 404 });
    }

    const user = await prismadb.user.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      return new NextResponse("Email already exists", { status: 404 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = await prismadb.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.log("REGISETE_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
