import { useQuery, UseQueryOptions } from "react-query";
import axios from "axios";

export interface Visited {
  [restaurantId: string]: boolean;
}

const fetcher = (userId: string) => async () => {
  try {
    const { data } = await axios.get(`/api/users/${userId}/visits`);

    if (!data.success) return;

    return data.result;
  } catch (error) {}
};

export const useVisitedRestaurants = (userId: string, options?: UseQueryOptions<Visited>) => {
  return useQuery<Visited>(["visited-restaurants"], fetcher(userId), {
    ...options,
    staleTime: 60 * 1000,
  });
};
