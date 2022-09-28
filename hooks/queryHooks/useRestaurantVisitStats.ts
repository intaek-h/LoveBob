import { UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { VisitStatsResponse } from "./../../pages/api/restaurants/[restaurantId]/visit-stats/index";
import { useQuery } from "@tanstack/react-query";
import RestaurantService from "../../services/RestaurantService";

type Options = UseQueryOptions<VisitStatsResponse, AxiosError>;

const useRestaurantVisitStats = (restaurantId: string, bobId: string, options?: Options) => {
  return useQuery<VisitStatsResponse, AxiosError>(
    ["visit-stats", restaurantId, bobId],
    () => RestaurantService.getVisitStats(restaurantId),
    {
      ...options,
    }
  );
};

export default useRestaurantVisitStats;
