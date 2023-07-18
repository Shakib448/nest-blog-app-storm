import instance from "@/utils/BaseURL";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import LoadingComponent from "./loading";

const ProfileSettings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await instance.get("/user/me");
      return data;
    },
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 border rounded shadow-md flex-grow">
        <h2 className="text-2xl font-bold mb-6">Update Password</h2>

        <div className="mb-6">
          <label htmlFor="currentPassword" className="block font-medium mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            className="w-full bg-gray-100 px-4 py-2 rounded"
            placeholder="Enter current password"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="newPassword" className="block font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full bg-gray-100 px-4 py-2 rounded"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="newPassword" className="block font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full bg-gray-100 px-4 py-2 rounded"
            placeholder="Enter new password"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
