import { TopReviewsResponse } from "./../pages/api/restaurants/[restaurantId]/top-reviews/index";
import { MyReviewVoteResponse } from "./../pages/api/posts/reviews/[reviewId]/my-vote/index";
import { ReviewCountResponse } from "./../pages/api/restaurants/[restaurantId]/review-count/index";
import { MyPagePaginationResponse } from "./../pages/api/users/[id]/posts/index";
import { DefaultResponse } from "./../apis/types";
import { PresignedUrlResponse } from "./../pages/api/images/presigned-url";
import axios, { AxiosInstance } from "axios";

export interface UploadReviewArgs {
  title: string;
  titleLink: string;
  content: string;
  preview: string;
  images: string[];
  userId: string;
  restaurantId: string;
}

export interface UpvoteReivewArgs {
  userId: string;
  reviewId: string;
}

export interface GetRecentReviewsOfUserArgs {
  userId: string;
  take: number;
  reviewId: string;
}

class ReviewService {
  constructor(private api: AxiosInstance) {}

  public getPresignedUrl = async (restaurantId: string, userId: string) => {
    const { data } = await this.api.get<PresignedUrlResponse>(
      `/api/images/presigned-url?restaurant=${restaurantId}&user=${userId}`
    );
    return data;
  };

  public uploadImageToPresignedUrl = async (presignedUrl: string, imageBlob: Buffer) =>
    await this.api.put(presignedUrl, imageBlob, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Encoding": "base64",
      },
    });

  public uploadReview = async ({
    title,
    titleLink,
    content,
    preview,
    images,
    userId,
    restaurantId,
  }: UploadReviewArgs) => {
    const { data } = await this.api.post<DefaultResponse>("/api/posts/reviews", {
      title,
      titleLink,
      content,
      preview,
      images,
      userId,
      restaurantId,
    });
    return data;
  };

  public getInfiniteReviews =
    (userId: string) =>
    async ({ pageParam = 1 }) => {
      const { data } = await this.api.get<MyPagePaginationResponse>(
        `/api/users/${userId}/posts?page=${pageParam}`
      );
      return data;
    };

  public getReviewVotes = async (reviewId: string) => {
    const { data } = await this.api.get<ReviewCountResponse>(
      `/api/posts/reviews/${reviewId}/votes`
    );
    return data;
  };

  public upvoteReview = async ({ userId, reviewId }: UpvoteReivewArgs) => {
    const { data } = await this.api.patch<DefaultResponse>(`/api/posts/reviews/${reviewId}/votes`, {
      type: "UPVOTE",
      userId,
    });
    return data;
  };

  public cancelReviewUpvote = async ({ userId, reviewId }: UpvoteReivewArgs) => {
    const { data } = await this.api.patch<DefaultResponse>(`/api/posts/reviews/${reviewId}/votes`, {
      type: "CANCEL_UPVOTE",
      userId,
    });
    return data;
  };

  public checkIfIVoted = async ({ userId, reviewId }: UpvoteReivewArgs) => {
    const { data } = await this.api.post<MyReviewVoteResponse>(
      `/api/posts/reviews/${reviewId}/my-vote`,
      {
        userId,
      }
    );
    return data;
  };

  public getRecentReviewsOfUser = async ({
    userId,
    take,
    reviewId,
  }: GetRecentReviewsOfUserArgs) => {
    const { data } = await this.api.get(
      `/api/users/${userId}/posts/more?take=${take}&skip=${reviewId}`
    );
    return data;
  };

  public getTopReviewsOfRestaurant = async (restaurantId: string, reviewId: string) => {
    const { data } = await this.api.get<TopReviewsResponse>(
      `/api/restaurants/${restaurantId}/top-reviews?take=3&skip=${reviewId}`
    );
    return data;
  };
}

export default new ReviewService(axios);
