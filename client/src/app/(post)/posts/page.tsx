import React from "react";
import { cookies } from "next/headers";

const Posts = () => {
  const cookieStore = cookies();
  const token: any = cookieStore.get("Authorization");

  console.log({ token: token.value });
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">This is post pages</h1>
        <p className="text-gray-600 mb-6">The content will be go there</p>
      </div>
    </div>
  );
};

export default Posts;