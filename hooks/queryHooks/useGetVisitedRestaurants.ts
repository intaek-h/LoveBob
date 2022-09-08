import { SESSION_STALE_TIME, SESSION_REFETCH_INTERVAL } from "./useSession";
import { ProfileResponse } from "./../../pages/api/users/index";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ProfileService from "../../services/ProfileService";

type Options = UseQueryOptions<ProfileResponse, AxiosError>;

const useGetVisitedRestaurants = (options?: Options) => {
  return useQuery<ProfileResponse, AxiosError>(
    ["user-profile"],
    ProfileService.getUserFromSession,
    {
      staleTime: SESSION_STALE_TIME,
      refetchInterval: SESSION_REFETCH_INTERVAL,
      ...options,
    }
  );
};

export default useGetVisitedRestaurants;
