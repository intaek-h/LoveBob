import { GetStaticPaths, GetStaticPropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import prisma from "../../../lib/prisma";
import InferNextPropsType from "infer-next-props-type";
import styled from "styled-components";
import { useRouter } from "next/router";
import Head from "next/head";
import HeaderContainer from "../../../containers/reviewPage/header/HeaderContainer";
import RestaurantContainer from "../../../containers/reviewPage/restaurant/RestaurantContainer";
import ArticleFooter from "../../../containers/reviewPage/articleFooter";
import Skeleton from "react-loading-skeleton";
import GalleryContainer from "../../../containers/reviewPage/imageCarousel/GalleryContainer";
import MoreArticles from "../../../containers/reviewPage/moreArticles";

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
          id: true,
          bobId: true,
          title: true,
          description: true,
          image: true,
          regions: true,
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

  if (!post) {
    return {
      notFound: true,
    };
  }

  let regions: string[] = [];

  if (post.user.regions) {
    const userRegions = await prisma.regions.findMany({
      where: {
        id: {
          in: post.user.regions?.split(",").map(Number),
        },
      },
    });

    regions = userRegions.map((region) => region.region);
  }

  const isFavoritePromise = prisma.visitedRestaurants.findFirst({
    where: {
      AND: [
        {
          userId: post.userId,
        },
        {
          restaurantId: post.restaurantId,
        },
      ],
    },
    select: {
      isFavorite: true,
    },
  });

  const [isFavorite] = await Promise.all([isFavoritePromise]);

  const filteredRestaurant = {
    name: `${post.restaurant.poi_nm} ${post.restaurant.branch_nm} ${post.restaurant.sub_nm}`,
    city: `${post.restaurant.sido_nm} ${post.restaurant.sgg_nm}`,
    roadAddress: `${post.restaurant.rd_nm} ${post.restaurant.bld_num}`,
    category: post.restaurant.mcate_nm,
    id: post.restaurantId,
    postCount: post.restaurant._count.Reviews,
    isFavorite: isFavorite?.isFavorite ?? false,
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

  const filteredUser = {
    userId: post.user.id,
    name: post.user.nickname,
    image: post.user.image,
    bobId: post.user.bobId,
    title: post.user.title,
    description: post.user.description,
    regions,
  };

  const props = {
    user: filteredUser,
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
      <Body>
        <LeftContainer>
          <Skeleton height={900} />
        </LeftContainer>
        <RightContainer>
          <Skeleton height={400} style={{ marginBottom: 50 }} />
          <Skeleton height={400} />
        </RightContainer>
      </Body>
    );

  return (
    <>
      <Head>
        <title>{review.title}</title>
      </Head>
      <Body>
        <LeftContainer>
          <article aria-label="restaurant-review-article">
            <HeaderContainer
              bobId={user.bobId}
              createdAt={review.createdAt}
              restaurantName={restaurant.name}
              reviewId={review.id}
              nickname={user.name!}
              postType={review.type}
              title={review.title}
              contentLength={review.content.length}
              profileImage={user.image}
              isFavorite={restaurant.isFavorite}
            />
            <RestaurantContainer
              bobId={user.bobId}
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              city={restaurant.city}
              roadAddress={restaurant.roadAddress}
            />
            {review.imageUrl[0] !== "" && <GalleryContainer urls={review.imageUrl} />}
            <Article
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: review.content }}
            />
            <ArticleFooter
              userId={user.userId}
              reviewId={review.id}
              nickname={user.name}
              regions={user.regions}
            />
          </article>
          <MoreArticles userId={user.userId} reviewId={review.id} bobId={user.bobId} />
        </LeftContainer>
        <RightContainer></RightContainer>
      </Body>
    </>
  );
};

const Body = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 90px;
`;

const LeftContainer = styled.section`
  width: 700px;
`;

const RightContainer = styled.aside`
  width: 450px;
`;

const Article = styled.article`
  width: 700px;
  padding: 0;
`;

export default PostPage;
