import { signOut } from "@/hooks/signOut";
import { UpdateCredentials } from "@/schema/sign-up.schema";
import instance from "@/utils/BaseURL";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ProfileSettings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(UpdateCredentials) as any,
  });

  const UpdatePassword = useMutation({
    mutationFn: async (formData) => {
      const { data } = await instance.patch(
        "/user/update/credentials",
        formData
      );
      return data;
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      signOut({ callbackUrl: "/sign-in" });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      await UpdatePassword.mutateAsync(formData as any);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-xl mx-auto bg-white p-8 border rounded shadow-md flex-grow">
        <h2 className="text-2xl font-bold mb-6">Update Password</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="currentPassword" className="block font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="w-full bg-gray-100 px-4 py-2 rounded"
              placeholder="Enter current password"
              {...register("currentPassword")}
            />
            {
              <span className="text-red-500">
                {errors.currentPassword?.message}
              </span>
            }
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
              {...register("newPassword")}
            />
            {
              <span className="text-red-500">
                {errors.newPassword?.message}
              </span>
            }
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
              {...register("confirmPassword")}
            />
            {
              <span className="text-red-500">
                {errors.confirmPassword?.message}
              </span>
            }
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
