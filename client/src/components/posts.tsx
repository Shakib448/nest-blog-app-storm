"use client";

import BlogCard from "@/module/BlogCard";
import instance from "@/utils/BaseURL";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import LoadingComponent from "./loading";

const PostComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await instance.get("/post");
      return data;
    },
  });

  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <div className="flex items-center justify-center my-20 h-screen">
      {data.length === 0 ? (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4">No post available</h1>
          <p className="text-gray-600 mb-6">
            The page haven't any posts available
          </p>
        </div>
      ) : (
        <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4  justify-center">
            {data.map((item: any, i: number) => (
              <BlogCard
                key={i}
                item={item}
                username={item?.user?.username}
                userImage={item?.user?.image}
                imageUrl={item?.image}
                title={item?.title}
                description={item?.description}
                comments={item?.comment}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComponent;
