import { GetRecentReviewsOfUserArgs } from "./../../services/ReviewService";
import { MoreReviewsResponse } from "./../../pages/api/users/[id]/posts/more/index";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ReviewService from "../../services/ReviewService";

type Options = UseQueryOptions<MoreReviewsResponse, AxiosError>;

const useAuthorRecentReviews = (
  { userId, take, reviewId }: GetRecentReviewsOfUserArgs,
  options?: Options
) => {
  return useQuery<MoreReviewsResponse, AxiosError>(
    ["recent-reviews-of-author", userId, reviewId],
    () => ReviewService.getRecentReviewsOfUser({ userId, take, reviewId }),
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export default useAuthorRecentReviews;
