import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="my-8 overflow-y-scroll">{children}</div>;
};

export default ProfileLayout;
