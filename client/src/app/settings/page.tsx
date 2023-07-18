"use client";

import ProfileSettings from "@/components/settings";
import WithSession from "@/utils/HOC/uesSessionEvents";

const ProfilePageSettings = () => {
  return <ProfileSettings />;
};

export default WithSession(ProfilePageSettings);
