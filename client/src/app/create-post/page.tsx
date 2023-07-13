import CreatePostComponent from "@/components/createPost";
import WithSession from "@/utils/HOC/uesSessionEvents";
import React from "react";

const CreatePost = () => {
  return <CreatePostComponent />;
};

export default WithSession(CreatePost);
