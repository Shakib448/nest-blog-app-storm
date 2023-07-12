"use client";

import PostComponent from "@/components/posts";
import WithSession from "@/utils/HOC/uesSessionEvents";

const ProfilePage = () => {
  return <PostComponent />;
};

export default WithSession(ProfilePage);
