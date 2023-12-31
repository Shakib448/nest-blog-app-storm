"use client";

import getUser from "@/hooks/getUser";
import instance from "@/utils/BaseURL";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Comment {
  id: number;
  username: string;
  comment: string;
  userImage?: string;
  user: {
    id: number;
    username: string;
    image: string;
  };
}

interface Inputs {
  comment: string;
}

interface Blog {
  item?: any;
  userImage?: string;
  username?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  comments?: Comment[];
}

const BlogCard = ({
  item,
  userImage = "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
  username,
  imageUrl = "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
  title,
  description,
  comments = [],
}: Blog) => {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  const { data: user } = getUser();

  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const CommentMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await instance.post(
        `/comment/create/${item.id}`,
        formData
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Comment created successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  const DeleteComment = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await instance.delete(`/comment/delete/${id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  const DeletePost = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await instance.delete(`/post/delete/${id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await CommentMutation.mutateAsync(data as any);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto rounded-lg cursor-pointer shadow-lg">
      <Link href={`/post/${item.id}`}>
        <div className="flex items-center p-4">
          <img
            src={userImage}
            alt={username}
            className="w-10 h-10 rounded-full mr-4"
          />

          <div style={{ marginLeft: "10px" }}>{username}</div>
        </div>

        <div className="h-64">
          <img
            src={imageUrl}
            alt="Blog"
            style={{ height: "400px", width: "100%" }}
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p>{description}</p>
        </div>
      </Link>

      <div className="p-4 bg-gray-100">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Do comment and You can delete update the post and delete comment"
              className="flex-grow bg-white rounded-full py-2 px-4 focus:outline-none"
              {...register("comment")}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full focus:outline-none"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
      {comments.length !== 0 && (
        <div className="p-4 bg-gray-200">
          <div className="flex justify-between">
            <button
              className="text-blue-500 hover:text-blue-600 focus:outline-none mb-4"
              onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
            >
              {isCommentsExpanded ? "Hide Comments" : "Show Comments"}
            </button>

            <Link
              href={`/update/post/${item.id}`}
              style={{ marginLeft: "10px", textDecoration: "underline" }}
            >
              Update Post
            </Link>

            <p
              style={{ marginLeft: "10px", textDecoration: "underline" }}
              onClick={async () => DeletePost.mutateAsync(item?.id)}
            >
              Delete Post
            </p>
          </div>

          {isCommentsExpanded && (
            <div className="mt-4">
              {comments.map((comment, index) => (
                <>
                  <div
                    key={index}
                    className="flex items-center space-x-2 my-2 mb-2 justify-between"
                  >
                    <img
                      src={comment?.user?.image}
                      alt={comment?.user?.username}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-bold">{comment.username}</div>
                      <div style={{ marginLeft: "10px" }}>
                        {comment.comment}
                      </div>
                    </div>
                    {user?.id === comment?.user?.id && (
                      <div style={{ marginLeft: "20px" }}>
                        <button
                          onClick={async () =>
                            DeleteComment.mutateAsync(comment?.id)
                          }
                          className="btn"
                        >
                          delete
                        </button>
                      </div>
                    )}
                  </div>
                  <hr />
                </>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogCard;
