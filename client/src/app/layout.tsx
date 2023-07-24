import Provider from "@/lib/Provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/common/Navbar";

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
          <Provider>
            <ToastContainer />
            <Navbar />
            {children}
          </Provider>
        }
      </body>
    </html>
  );
}
