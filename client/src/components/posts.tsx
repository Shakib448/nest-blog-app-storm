import instance from "@/utils/BaseURL";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const { data } = useQuery({
  queryKey: ["user"],
  queryFn: async () => {
    const { data } = await instance.get("/user/me");
    return data;
  },
});
const PostComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">{data?.username}</h1>
        <p className="text-gray-600 mb-6">The content will be go there</p>
      </div>
    </div>
  );
};

export default PostComponent;
