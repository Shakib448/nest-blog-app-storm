import instance from "@/utils/BaseURL";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Credentials = {
  email: string;
  password: string;
};

const providers = [
  CredentialsProvider({
    name: "credentials",
    // @ts-ignore
    async authorize(credentials: Credentials) {
      try {
        const res = await instance.post("/auth/login", {
          email: credentials.email,
          password: credentials.password,
        });

        // @ts-ignore
        const access_token = res.headers["set-cookie"][0]
          .split(";")[0]
          .split("=")[1];

        if (res.data.status === "OK") {
          return { access_token };
        }
      } catch (e: any) {
        const errorMessage = e.response.data.message;
        throw new Error(errorMessage);
      }
    },
  }),
];

const callbacks = {
  async signIn() {
    const isAllowedToSignIn = true;
    if (isAllowedToSignIn) {
      return true;
    } else {
      return false;
    }
  },

  async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    else if (new URL(url).origin === baseUrl) return url;
    return baseUrl;
  },
};

const authOptions: NextAuthOptions = {
  providers,
  //   @ts-ignore
  callbacks,
  secret: "somesecret",
  session: {
    maxAge: 3 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: "Authorization",
      options: {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/sign-in",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
