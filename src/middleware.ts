import { NextRequest, NextResponse } from "next/server";

const API_KEYS = process.env.API_KEYS?.split(",") ?? [];
const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://www.ethgastracker.com', 'https://www.useweb3.xyz'];

export async function middleware(req: NextRequest) {
  const apiKey = getParameterByName("apiKey", req.nextUrl.href);
  console.log("API Request", req.nextUrl.href, "|", "origin", req.nextUrl.origin);

  if (ALLOWED_ORIGINS.includes(req.nextUrl.origin)) {
    return NextResponse.next();
  }

  if (!apiKey) {
    return NextResponse.json("No API Key provided", { status: 401 });
  }

  if (!API_KEYS.includes(apiKey)) {
    console.log('Invalid API Key', apiKey);
    return NextResponse.json("Invalid API Key", { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};

function getParameterByName(name: string, url: string) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
