import { NextRequest, NextResponse } from "next/server";

const API_KEYS = process.env.API_KEYS?.split(",") ?? [];
const ALLOWED_ORIGINS = [
  "https://www.ethgastracker.com",
  "https://www.useweb3.xyz",
];

const SAMPLE = Number(process.env.API_LOG_SAMPLE ?? "1");

function getApiKey(req: NextRequest) {
  return req.nextUrl.searchParams.get("apiKey") ?? undefined;
}

function parseEndpointAndNetwork(pathname: string) {
  const p = pathname.replace(/^\/api/, "");
  const parts = p.split("/").filter(Boolean);

  let endpoint = parts[1] || parts[0] || "gas";
  if (
    parts[0] === "gas" &&
    !["latest", "history", "average"].includes(endpoint)
  ) {
    endpoint = "gas";
  }

  if (parts[0] === "blobs") endpoint = "blobs";

  let network = "mainnet";
  const last = parts[parts.length - 1];
  if (last && last !== endpoint && last !== "gas") network = last.toLowerCase();

  return { endpoint, network };
}

function logUsage(req: NextRequest, apiKey?: string) {
  if (Math.random() >= SAMPLE) return;
  const { pathname } = req.nextUrl;
  const { endpoint, network } = parseEndpointAndNetwork(pathname);

  console.log(
    JSON.stringify({
      kind: "api_log",
      ts: new Date().toISOString(),
      path: pathname,
      endpoint,
      network,
      apiKey,
      ua: req.headers.get("user-agent") || undefined,
    })
  );
}

export async function middleware(req: NextRequest) {
  const apiKey = getApiKey(req);

  if (ALLOWED_ORIGINS.includes(req.nextUrl.origin)) {
    logUsage(req, "ALLOWED ORIGIN");
    return NextResponse.next();
  }

  if (!apiKey) {
    return NextResponse.json("No API Key provided", { status: 401 });
  }

  if (!API_KEYS.includes(apiKey)) {
    console.log(
      JSON.stringify({
        kind: "api_log_warn",
        reason: "invalid_key",
        path: req.nextUrl.pathname,
        apiKey,
      })
    );
    return NextResponse.json("Invalid API Key", { status: 401 });
  }

  logUsage(req, apiKey);
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/gas", "/api/gas/:path*", "/api/blobs/:path*"],
};
