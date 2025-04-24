// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    // Return user data or token
    return NextResponse.json({ message: "Login successful", user });
  } catch (error) {
    console.log("[LOGIN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}