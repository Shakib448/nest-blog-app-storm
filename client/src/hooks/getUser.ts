import instance from "@/utils/BaseURL";
import { useQuery } from "@tanstack/react-query";

const getUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await instance.get("/user/me");
      return data;
    },
  });

  return { data, isLoading };
};

export default getUser;
