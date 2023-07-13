import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { signInSchema } from "@/schema/sign-in.schema";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import instance from "@/utils/BaseURL";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

const SingIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs, any>({
    resolver: yupResolver(signInSchema) as any,
  });
  const SignInMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await instance.post("/auth/login", formData);
      return data;
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      const res = await SignInMutation.mutateAsync(formData as any);
      if (res) {
        router.push("/profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="bg-gray 100">
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white shadow p-6 rounded-lg max-w-sm w-full shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Sign in</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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

            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign in
            </button>

            <div className="mt-2 text-center">
              <Link href="/">Not have an any account?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SingIn;
