import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const isAuth = request.cookies.get("Authorization");

  if (!isAuth) {
    redirect(process.env.NEXTAUTH_URL + "/sign-in");
  }

  const response = new Response(
    JSON.stringify({
      authenticated: !!isAuth,
    })
  );

  return response;
}
