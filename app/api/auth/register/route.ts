import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { sendEmail } from "@/app/lib/email"

const prisma = new PrismaClient() 

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const exist = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (exist) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    // Send welcome email (async, but don't block)
    sendEmail(
      email,
      "Welcome to Tasteful Picks!",
      `Hi ${name}, thank you for registering at Tasteful Picks.`,
      `<p>Hi ${name},</p><p>Thank you for joining <strong>Tasteful Picks</strong>! Start exploring movies now.</p>`
    ).catch(console.error)

    return NextResponse.json(user)
  } catch (error) {
    console.log("[REGISTER_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 