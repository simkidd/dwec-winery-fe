// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { TOKEN_NAME, USER_DETAILS } from "./constants/app.constant";
import { IUser } from "./interfaces/user.interface";

const privateRoutes = ["/account"];
const authRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(TOKEN_NAME)?.value;
  const userCookie = req.cookies.get(USER_DETAILS)?.value;

  let user: IUser | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie) as IUser;
    } catch (error) {
      console.error("Failed to parse user details:", error);
      // Clear invalid user cookie
      const response = NextResponse.next();
      response.cookies.delete(USER_DETAILS);
      return response;
    }
  }

  console.log("from middleware>>>", {
    token,
    user,
  });

  // Redirect authenticated users from auth routes to homepage
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Handle private routes
  if (privateRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
