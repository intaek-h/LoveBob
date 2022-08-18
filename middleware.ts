import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "./lib/prisma";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/")[2];

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/users/:id*",
};
