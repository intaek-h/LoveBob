import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MyPagePaginationResponse } from "../../pages/api/users/[id]/posts";
import ReviewService from "../../services/ReviewService";

type Options = UseInfiniteQueryOptions<MyPagePaginationResponse, AxiosError>;

const useInfiniteReviews = (bobId: string, userId: string, options?: Options) => {
  return useInfiniteQuery<MyPagePaginationResponse, AxiosError>(
    ["my-page-reviews", bobId],
    ReviewService.getInfiniteReviews(userId),
    {
      ...options,
    }
  );
};

export default useInfiniteReviews;
