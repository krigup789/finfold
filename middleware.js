<<<<<<< HEAD
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

=======
// middleware.js
import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes require authentication
>>>>>>> 1c07ac6 (aug update)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
  "/portfolio(.*)",
  "/bills(.*)",
]);

<<<<<<< HEAD
export default clerkMiddleware(async (auth, req) => {
=======
// Arcjet middleware instance
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "GO_HTTP", // For Inngest
      ],
    }),
  ],
});

// Clerk middleware instance
const clerk = clerkMiddleware(async (auth, req) => {
>>>>>>> 1c07ac6 (aug update)
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
<<<<<<< HEAD
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)", "/(api|trpc)(.*)"],
=======

  return NextResponse.next();
});

// Chain Arcjet first, then Clerk
export default createMiddleware(aj, clerk);

// Middleware matcher — excludes static assets but includes APIs
export const config = {
  matcher: [
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
>>>>>>> 1c07ac6 (aug update)
};
