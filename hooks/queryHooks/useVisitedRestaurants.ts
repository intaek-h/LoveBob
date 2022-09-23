import { VisitedRestaurantResponse } from "../../pages/api/users/[id]/visits/index";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ProfileService from "../../services/ProfileService";

type Options = UseQueryOptions<VisitedRestaurantResponse, AxiosError>;

export const useVisitedRestaurants = (userId: string, options?: Options) => {
  return useQuery<VisitedRestaurantResponse, AxiosError>(
    ["visited-restaurants", userId],
    ProfileService.getVisitedRestaurants(userId),
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
