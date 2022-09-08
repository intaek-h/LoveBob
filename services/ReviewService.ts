import { DefaultResponse } from "./../apis/types";
import { PresignedUrlResponse } from "./../pages/api/images/presigned-url";
import axios, { AxiosInstance } from "axios";

interface UploadReviewArgs {
  title: string;
  content: string;
  images: string[];
  userId: string;
  restaurantId: string;
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
    content,
    images,
    userId,
    restaurantId,
  }: UploadReviewArgs) => {
    const { data } = await this.api.post<DefaultResponse>("/api/posts/reviews", {
      title,
      content,
      images,
      userId,
      restaurantId,
    });
    return data;
  };
}

export default new ReviewService(axios);
