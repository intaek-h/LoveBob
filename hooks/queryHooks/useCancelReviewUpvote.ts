import ReviewService, { UpvoteReivewArgs } from "./../../services/ReviewService";
import { DefaultResponse } from "./../../apis/types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

type Options = UseMutationOptions<DefaultResponse, AxiosError, UpvoteReivewArgs>;

const useCancelReviewUpvote = (options?: Options) => {
  return useMutation<DefaultResponse, AxiosError, UpvoteReivewArgs>(
    ReviewService.cancelReviewUpvote,
    {
      ...options,
    }
  );
};

export default useCancelReviewUpvote;
