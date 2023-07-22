import ShowImage from "@/hooks/showImage";
import instance from "@/utils/BaseURL";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  title: string;
  description: string;
};

const CreatePostComponent = () => {
  const { handleImageChange, imageObjectURL, imageFile } = ShowImage();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<Inputs>();

  const CreatePost = useMutation({
    mutationFn: async (formData) => {
      const { data } = await instance.post("/post/create", formData);
      return data;
    },
    onError: (err: any) => {
      toast.error(err?.response?.data.message);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/");
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("image", imageFile as any);

    try {
      await CreatePost.mutateAsync(formData as any);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-xl bg-white p-8 border rounded shadow-md flex-grow">
        <h2 className="text-2xl font-bold mb-6">Create Post</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="profilePicture" className="cursor-pointer">
              {imageObjectURL ? (
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
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full bg-gray-100 px-4 py-2 rounded"
              placeholder="Enter the title"
              {...register("title")}
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
              {...register("description")}
              rows={5}
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
