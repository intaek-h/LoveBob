import { GetStaticPaths, GetStaticPropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import prisma from "../../../lib/prisma";
import InferNextPropsType from "infer-next-props-type";
import styled from "styled-components";
import { useRouter } from "next/router";

interface Params extends ParsedUrlQuery {
  bobId: string;
  titleLink: string;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { bobId, titleLink } = context.params as Params;

  const post = await prisma.reviews.findFirst({
    where: {
      titleLink,
    },
    include: {
      user: {
        select: {
          nickname: true,
          bobId: true,
          title: true,
          description: true,
          image: true,
        },
      },
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
      ReviewImages: {
        select: {
          urls: true,
        },
      },
    },
  });

  if (!post)
    return {
      notFound: true,
    };

  const filteredRestaurant = {
    name: `${post.restaurant.poi_nm} ${post.restaurant.branch_nm} ${post.restaurant.sub_nm}`,
    city: `${post.restaurant.sido_nm} ${post.restaurant.sgg_nm}`,
    roadAddress: `${post.restaurant.rd_nm} ${post.restaurant.bld_num}`,
    category: post.restaurant.mcate_nm,
    id: post.restaurantId,
    postCount: post.restaurant._count.Reviews,
  };

  const filteredReviews = {
    id: post.id,
    title: post.title,
    titleLink: post.titleLink,
    content: post.content,
    imageUrl: post.ReviewImages[0].urls.split(","),
    preview: post.preview,
    createdAt: post.createdAt.getTime(),
    updatedAt: post.updatedAt.getTime(),
    type: "식당 리뷰",
  };

  const user = post.user;

  const props = {
    user,
    review: filteredReviews,
    restaurant: filteredRestaurant,
  };

  return {
    props,
  };
};

export type PostPageStaticProps = InferNextPropsType<typeof getStaticProps>;

const PostPage = ({ restaurant, review, user }: PostPageStaticProps) => {
  const router = useRouter();

  if (router.isFallback)
    return (
      <div>
        <span>스켈레톤 올 자리</span>
      </div>
    );

  return (
    <div>
      <Article className="markdown-body" dangerouslySetInnerHTML={{ __html: review.content }} />
    </div>
  );
};

const Article = styled.article`
  width: 700px;
`;

export default PostPage;
