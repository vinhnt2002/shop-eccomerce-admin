import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export const  POST = async (req:Request)=> {
  try {
    const { userId } = auth();

    const body = await req.json();

    

    const { name ,code} = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!code) {
      return new NextResponse("Code is required", { status: 400 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        code
      },
    });
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export const  DELETE = async (req:Request)=> {
  try {
    const { userId } = auth();

    const body = await req.json();

    const ids = body



    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!ids) {
      return new NextResponse("ids is required", { status: 400 });
    }

    const categories = await prismadb.category.deleteMany({
      where:{
        id:{
          in:ids
        }
      }
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export const GET = async (req: Request)=>{
    try {
      const categories = await prismadb.category.findMany({})

      return NextResponse.json(categories)
      
    } catch (error) {
      console.log("CATEGORY_GET", error);
      return new NextResponse("Internal error", {status: 500})
      
    }
}