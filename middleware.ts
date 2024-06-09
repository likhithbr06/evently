import { authMiddleware ,clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";


const isProtectedRoute = createRouteMatcher(["/events:id","/api/webhook/clerk","/api/webhook/stripe","/api/uploadthing"]);
export default clerkMiddleware((auth,req)=>{
    if (isProtectedRoute(req)) {     auth().protect(); }
});


//export default authMiddleware({})
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};