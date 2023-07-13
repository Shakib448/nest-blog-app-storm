"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const WithSession = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithSession: React.FC<P> = (props) => {
    const router = useRouter();
    useEffect(() => {
      const handleClick = async () => {
        const { data } = await axios.get("/api/getToken");
        if (!data.authenticated) {
          router.push("/sign-in");
        }
      };

      const handleKeyDown = async () => {
        const { data } = await axios.get("/api/getToken");
        if (!data.authenticated) {
          router.push("/sign-in");
        }
      };

      const handleScroll = async () => {
        const { data } = await axios.get("/api/getToken");
        if (!data.authenticated) {
          router.push("/sign-in");
        }
      };

      const handleLoad = async () => {
        const { data } = await axios.get("/api/getToken");
        if (!data.authenticated) {
          router.push("/sign-in");
        }
      };

      window.addEventListener("click", handleClick);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("load", handleLoad);

      return () => {
        window.removeEventListener("click", handleClick);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("load", handleLoad);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WithSession;
};

export default WithSession;
