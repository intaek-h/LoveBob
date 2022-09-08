import { VisitedRestaurantResponse } from "../../pages/api/users/[id]/visits/index";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ProfileService from "../../services/ProfileService";

type Options = UseQueryOptions<VisitedRestaurantResponse, AxiosError>;

const STALE_TIME = 60 * 1000 * 10; // 10 minutes

export const useVisitedRestaurants = (userId: string, options?: Options) => {
  return useQuery<VisitedRestaurantResponse, AxiosError>(
    ["visited-restaurants"],
    ProfileService.getVisitedRestaurants(userId),
    {
      staleTime: STALE_TIME,
      ...options,
    }
  );
};
