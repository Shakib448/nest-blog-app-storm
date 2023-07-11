import instance from "@/utils/BaseURL";
import type { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

type Inputs = {
  email: string;
  password: string;
};

const providers = [
  CredentialsProvider({
    name: "credentials",
    // @ts-ignore
    async authorize(credentials: Inputs) {
      try {
        const res = await instance.post("/auth/login", {
          email: credentials.email,
          password: credentials.password,
        });

        if (res.data) {
          return {
            result: {
              ...res.data.user,
            },
          };
        }
      } catch (e: any) {
        const errorMessage = e.response.data.message;
        throw new Error(errorMessage);
      }
    },
  }),
];

const callbacks = {
  async jwt({ token, user }: { token: JWT; user: any }) {
    if (user) {
      token.accessToken = user?.result?.access_token;
      token.name = user?.result?.username;
      token.email = user?.result?.email;
      token.picture = "N/A";
      token.sub = user?.result?.id;
    }
    return token;
  },

  async session({ session, token }: { session: any; token: JWT }) {
    session.accessToken = token.accessToken;
    session.user.name = token.name;
    session.user.email = token.email;
    session.user.image = "N/A";
    return session;
  },
};

export const authOptions: NextAuthOptions = {
  providers,
  callbacks,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/sign-in",
  },
};
