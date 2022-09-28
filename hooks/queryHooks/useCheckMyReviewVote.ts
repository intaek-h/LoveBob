import { MyReviewVoteResponse } from "./../../pages/api/posts/reviews/[reviewId]/my-vote/index";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ReviewService from "../../services/ReviewService";

type Options = UseQueryOptions<MyReviewVoteResponse, AxiosError>;

const useCheckMyReviewVote = (userId: string, reviewId: string, options?: Options) => {
  return useQuery<MyReviewVoteResponse, AxiosError>(
    ["my-review-vote", reviewId, userId],
    () => ReviewService.checkIfIVoted({ userId, reviewId }),
    {
      ...options,
    }
  );
};

export default useCheckMyReviewVote;
