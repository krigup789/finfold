// app/api/test/route.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();

  return Response.json({
    success: true,
    data: users,
  });
}
