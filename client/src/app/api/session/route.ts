import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ status: "fail", message: "You are not logged in" }),
      { status: 401 }
    );
  }
  // @ts-ignore
  const authToken = session.accessToken;

  const response = new Response(
    JSON.stringify({
      authenticated: !!session,
      session,
    })
  );

  // response.headers.append(
  //   "Set-Cookie",
  //   `Authorization=${authToken}; HttpOnly; Secure; Path=/; SameSite=Lax; Expires=${new Date(
  //     Date.now() + 3 * 24 * 60 * 60 * 1000
  //   ).toUTCString()}`
  // );

  return response;
}
