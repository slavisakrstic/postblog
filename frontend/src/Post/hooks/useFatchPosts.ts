import { useEffect, useState } from "react";
import { useQuery } from "react-query";

// API
import { POSTS_KEY, getAllPosts } from "../../api";

export const useFatchPosts = () => {
  const [fetch, setFetch] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery(
    [POSTS_KEY, {}],
    () => getAllPosts()
  );

  useEffect(() => {
    if (fetch) {
      refetch();
    }
    setFetch(false);
  }, [fetch, refetch])

  return {
    data,
    isError,
    isLoading,
    errorCode: (error as any)?.response?.status,
    setFetch
  };
}