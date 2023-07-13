"use client";

import ProfileComponent from "@/components/profile";
import WithSession from "@/utils/HOC/uesSessionEvents";

const ProfilePage = () => {
  return <ProfileComponent />;
};

export default WithSession(ProfilePage);
