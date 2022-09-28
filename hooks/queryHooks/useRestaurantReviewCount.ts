import { ReviewCountResponse } from "./../../pages/api/restaurants/[restaurantId]/review-count/index";
import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import RestaurantService from "../../services/RestaurantService";

type Options = UseQueryOptions<ReviewCountResponse, AxiosError>;

const useRestaurantReviewCount = (restaurantId: string, options?: Options) => {
  return useQuery<ReviewCountResponse, AxiosError>(
    ["review-count", restaurantId],
    () => RestaurantService.getReviewCount(restaurantId),
    {
      ...options,
    }
  );
};

export default useRestaurantReviewCount;
