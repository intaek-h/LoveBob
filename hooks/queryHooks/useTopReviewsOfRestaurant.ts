import { TopReviewsResponse } from "./../../pages/api/restaurants/[restaurantId]/top-reviews/index";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ReviewService from "../../services/ReviewService";

type Options = UseQueryOptions<TopReviewsResponse, AxiosError>;

const useTopReviewsOfRestaurant = (restaurantId: string, reviewId: string, options?: Options) => {
  return useQuery<TopReviewsResponse, AxiosError>(
    ["top-reviews-of-restaurant", restaurantId, reviewId],
    () => ReviewService.getTopReviewsOfRestaurant(restaurantId, reviewId),
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export default useTopReviewsOfRestaurant;
