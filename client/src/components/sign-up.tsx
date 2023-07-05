"use client";

import { signUpSchema } from "@/schema/sign-up.schema";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import instance from "@/utils/BaseURL";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Inputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SingUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs, any>({
    resolver: yupResolver(signUpSchema) as any,
  });

  const router = useRouter();

  const SignUpMutation = useMutation({
    mutationFn: async (formData) => {
      const data = await instance.post("/auth/register", formData);
      return data;
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      const res: any = await SignUpMutation.mutateAsync(formData as any);

      if (res?.data?.status === "OK") {
        router.push("/posts");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="bg-gray 100">
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white shadow p-6 rounded-lg max-w-sm w-full shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Sign up</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded"
                type="text"
                id="username"
                placeholder="Enter your username"
                {...register("username")}
              />
              {<span className="text-red-500">{errors.username?.message}</span>}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded"
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {<span className="text-red-500">{errors.email?.message}</span>}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded"
                type="password"
                id="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {<span className="text-red-500">{errors.password?.message}</span>}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Confirm Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded"
                type="password"
                id="confirmPassword"
                placeholder="Enter your confirmPassword"
                {...register("confirmPassword")}
              />
              {
                <span className="text-red-500">
                  {errors.confirmPassword?.message}
                </span>
              }
            </div>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign up
            </button>

            <div className="mt-2 text-center">
              <Link href="/sign-in">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SingUp;
