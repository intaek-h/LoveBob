import { NearbyRestaurantsOfRestaurantResponse } from "./../../pages/api/restaurants/[restaurantId]/nearby/index";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import RestaurantService from "../../services/RestaurantService";

type Options = UseQueryOptions<NearbyRestaurantsOfRestaurantResponse, AxiosError>;

const useNearbyRestaurantsOfRestaurant = (restaurantId: string, options?: Options) => {
  return useQuery<NearbyRestaurantsOfRestaurantResponse, AxiosError>(
    ["nearby-restaurants-of-restaurants", restaurantId],
    () => RestaurantService.getNearbyRestaurantsOfRestaurant(restaurantId),
    {
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export default useNearbyRestaurantsOfRestaurant;
