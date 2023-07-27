import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
import prismadb from "@/lib/prismadb";


export async function POST(request: NextRequest){
    try {

        const body = await request.json()
        const {email, password} = body;
        // console.log(body);

        //check if user exists
        const user = await prismadb.user.findFirst({
            where: {email}
        })
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        console.log("user exists");
        
        
        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        

        return NextResponse.json(user)
    } catch (error: any) {
        console.log("LOGIN_POST" ,error);
        return new NextResponse("Internal error", { status: 500 });
    }
}