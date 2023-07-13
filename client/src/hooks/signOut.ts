import instance from "@/utils/BaseURL";

export const signOut = ({ callbackUrl }: { callbackUrl: string }) => {
  (async () => {
    const { data } = await instance.post("/auth/logout");
    if (typeof window !== "undefined" && data) {
      (window as Window & typeof globalThis).location.href = callbackUrl!;
    }
    return data;
  })();
};
