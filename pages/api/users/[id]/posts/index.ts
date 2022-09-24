import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { DefaultResponse } from "./../../../../../apis/types";
import prisma from "../../../../../lib/prisma";
import { MY_PAGE_REVIEWS_PER_QUERY } from "../../../../../constants/policies";

type FilteredReview = {
  id: string;
  title: string;
  titleLink: string;
  imageUrl: string;
  preview: string;
  restaurant: string;
  restaurantId: string;
  createdAt: number;
  likeCount: number;
  commentCount: number;
  type: string;
  isFavorite: boolean;
};

export interface MyPagePaginationResponse extends DefaultResponse {
  result?: {
    reviews: FilteredReview[];
    page: number;
    isLastPage: boolean;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MyPagePaginationResponse>
) {
  const userId = req.query.id as string;
  const { page } = req.query;

  if (!page) {
    return res.status(400).json({ success: false });
  }

  const userPromise = prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      VisitedRestaurants: {
        include: {
          restaurant: {
            select: {
              _count: {
                select: { Reviews: true },
              },
              poi_nm: true,
              branch_nm: true,
              sub_nm: true,
              sido_nm: true,
              sgg_nm: true,
              rd_nm: true,
              bld_num: true,
              mcate_nm: true,
            },
          },
        },
      },
    },
  });

  const reviewsPromise = prisma.reviews.findMany({
    where: {
      userId,
    },
    include: {
      restaurant: {
        select: {
          poi_nm: true,
          branch_nm: true,
          sub_nm: true,
        },
      },
      ReviewImages: {
        select: {
          urls: true,
        },
      },
      _count: {
        select: { ReviewComments: true, ReviewLikes: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: Number(page) * MY_PAGE_REVIEWS_PER_QUERY,
    take: MY_PAGE_REVIEWS_PER_QUERY,
  });

  try {
    const [user, reviews] = await Promise.all([userPromise, reviewsPromise]);

    if (!reviews || !user) {
      return res.status(400).json({ success: false });
    }

    const filteredReviews = reviews.map((review, i) => ({
      id: review.id,
      title: review.title,
      titleLink: review.titleLink,
      imageUrl: review.ReviewImages[0].urls.split(",")[0],
      preview: review.preview,
      restaurant:
        `${review.restaurant.poi_nm} ${review.restaurant.branch_nm} ${review.restaurant.sub_nm}`.trim(),
      restaurantId: review.restaurantId,
      createdAt: review.createdAt.getTime(),
      likeCount: review._count.ReviewLikes,
      commentCount: review._count.ReviewComments,
      type: "식당 리뷰",
      isFavorite: user.VisitedRestaurants.some(
        (restaurant) =>
          restaurant.restaurantId === review.restaurantId && restaurant.isFavorite === true
      ),
    }));

    return res.status(200).json({
      success: true,
      result: {
        reviews: filteredReviews,
        page: Number(page) + 1,
        isLastPage: reviews.length < MY_PAGE_REVIEWS_PER_QUERY,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
