import { ReviewCountResponse } from "./../../pages/api/restaurants/[restaurantId]/review-count/index";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ReviewService from "../../services/ReviewService";

type Options = UseQueryOptions<ReviewCountResponse, AxiosError>;

const useReviewVoteCount = (reviewId: string, options?: Options) => {
  return useQuery<ReviewCountResponse, AxiosError>(
    ["review-vote-count", reviewId],
    () => ReviewService.getReviewVotes(reviewId),
    {
      ...options,
    }
  );
};

export default useReviewVoteCount;
