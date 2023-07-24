"use client";
import LoadingComponent from "@/components/loading";
import BlogCard from "@/module/BlogCard";
import instance from "@/utils/BaseURL";
import { useQuery } from "@tanstack/react-query";

export default function Page({ params }: { params: { id: string } }) {
  const { data: item, isLoading } = useQuery({
    queryKey: ["post", params.id],
    queryFn: async () => {
      const { data } = await instance.get(`/post/${params.id}`);
      return data;
    },
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex items-center justify-center my-20">
      <div className="w-full p-4">
        <BlogCard
          item={item}
          username={item?.user?.username}
          userImage={item?.user?.image}
          imageUrl={item?.image}
          title={item?.title}
          description={item?.description}
          comments={item?.comment}
        />
      </div>
    </div>
  );
}
