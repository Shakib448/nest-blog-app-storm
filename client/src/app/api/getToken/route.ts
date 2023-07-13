import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const isAuth = request.cookies.get("Authorization");

  const response = new Response(
    JSON.stringify({
      authenticated: !!isAuth,
    })
  );

  return response;
}
