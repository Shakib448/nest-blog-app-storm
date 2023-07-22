import instance from "@/utils/BaseURL";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import LoadingComponent from "./loading";
import { SubmitHandler, useForm } from "react-hook-form";
import ShowImage from "@/hooks/showImage";
import { toast } from "react-toastify";
import getUser from "@/hooks/getUser";

type Inputs = {
  username: string;
  description: string;
};

const ProfileComponent = () => {
  const { data, isLoading } = getUser();
  const { handleImageChange, imageObjectURL, imageFile } = ShowImage();

  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<Inputs>();

  const ProfileUpdateMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await instance.patch("/user/update/profile", formData);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: () => {
      toast.error("Image should be less than 1.5mb");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("description", data.description);
    formData.append("image", imageFile as any);

    try {
      await ProfileUpdateMutation.mutateAsync(formData as any);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 border rounded shadow-md flex-grow">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-center mb-6">
            <label htmlFor="profilePicture" className="cursor-pointer">
              {data?.image !== null ? (
                <img
                  src={data?.image}
                  alt="Uploaded Image"
                  className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center"
                />
              ) : imageObjectURL ? (
                <img
                  src={imageObjectURL}
                  alt="Uploaded Image"
                  className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center"
                />
              ) : (
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
              )}

              <input
                type="file"
                id="profilePicture"
                accept="image/png, image/jpg, image/jpeg"
                className="hidden"
                onChange={handleImageChange}
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
              defaultValue={data?.username}
              {...register("username")}
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
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              className="w-full bg-gray-100 px-4 py-2 rounded"
              placeholder="Enter description"
              rows={5}
              {...register("description")}
              defaultValue={data?.description}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileComponent;
