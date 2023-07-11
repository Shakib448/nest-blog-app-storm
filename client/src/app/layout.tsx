import Provider from "@/utils/Provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextAuthProvider } from "../lib/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog Storm",
  description: "This is a general blog app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {
          <NextAuthProvider>
            <Provider>
              <ToastContainer />
              {children}
            </Provider>
          </NextAuthProvider>
        }
      </body>
    </html>
  );
}
