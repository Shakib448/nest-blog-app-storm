"use client";

import CreatePostComponent from "@/components/createPost";
import LoadingComponent from "@/components/loading";
import instance from "@/utils/BaseURL";
import WithSession from "@/utils/HOC/uesSessionEvents";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const UpdatePost = ({ params }: { params: { id: string } }) => {
  const { data: item, isLoading } = useQuery({
    queryKey: ["post", params.id],
    queryFn: async () => {
      const { data } = await instance.get(`/post/${params.id}`);
      return data;
    },
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  return <CreatePostComponent item={item} />;
};

export default WithSession(UpdatePost);
