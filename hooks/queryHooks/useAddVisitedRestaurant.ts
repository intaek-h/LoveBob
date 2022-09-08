import { DefaultResponse } from "./../../apis/types";
import { VisitedRestaurantArgs } from "./../../services/ProfileService";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ProfileService from "../../services/ProfileService";

type Options = UseMutationOptions<DefaultResponse, AxiosError, VisitedRestaurantArgs>;

const useAddVisitedRestaurant = (options?: Options) => {
  return useMutation<DefaultResponse, AxiosError, VisitedRestaurantArgs>(
    ProfileService.addVisitedRestaurant,
    { ...options }
  );
};

export default useAddVisitedRestaurant;
