import instance from "@/utils/BaseURL";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const ProfileComponent = () => {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await instance.get("/user/me");
      return data;
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 border rounded shadow-md flex-grow">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        <div className="flex items-center justify-center mb-6">
          <label htmlFor="profilePicture" className="cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-10 w-10 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        <div className="mb-6">
          <label htmlFor="username" className="block font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full bg-gray-100 px-4 py-2 rounded"
            value={data?.username}
            readOnly
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full bg-gray-100 px-4 py-2 rounded"
            value={data?.email}
            readOnly
          />
        </div>

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

        <div className="mb-6">
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            className="w-full bg-gray-100 px-4 py-2 rounded"
            placeholder="Enter description"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
