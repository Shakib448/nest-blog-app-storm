import axios from "axios";
import { useEffect } from "react";

const WithSession = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithSession: React.FC<P> = (props) => {
    useEffect(() => {
      const handleClick = async () => {
        await axios.get("/api/getToken");
      };

      const handleKeyDown = async () => {
        await axios.get("/api/getToken");
      };

      const handleScroll = async () => {
        await axios.get("/api/getToken");
      };

      const handleLoad = async () => {
        await axios.get("/api/getToken");
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
