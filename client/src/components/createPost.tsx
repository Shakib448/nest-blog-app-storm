import React from "react";

const CreatePostComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-xl bg-white p-8 border rounded shadow-md flex-grow">
        <h2 className="text-2xl font-bold mb-6">Create Post</h2>
        <form>
          <div className="mb-6">
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
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full bg-gray-100 px-4 py-2 rounded"
              placeholder="Enter the title"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="w-full bg-gray-100 px-4 py-2 rounded"
              placeholder="Enter the description"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostComponent;
