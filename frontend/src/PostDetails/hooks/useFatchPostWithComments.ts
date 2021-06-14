import { useQuery } from "react-query";
import { POST_WITH_COMMENTS_KEY, getPostWithCommentsById } from "../../api";
import { useEffect, useState } from "react";

export const useFatchPostWithComments = (id: number,) => {
  const [fetch, setFetch] = useState(false);
  const { data, isLoading, isError, error, refetch } = useQuery(
    [POST_WITH_COMMENTS_KEY, {}],
    () => getPostWithCommentsById(id)
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