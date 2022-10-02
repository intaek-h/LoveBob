import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import styled from "styled-components";
import CustomizedAccordions from "../../components/accordion";
import NearbySearchContainer from "../../containers/nearbySearch/NearbySearchContainer";
import MapChartContainer from "../../containers/mapChart/MapChartContainer";
import ProfileContainer from "../../containers/profile/ProfileContainer";
import VisitedRestaurantsContainer from "../../containers/visitedRestaurants/visitedRestaurantsContainer";
import prisma from "../../lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]";
import PostListContainer from "../../containers/postList";
import InferNextPropsType from "infer-next-props-type";
import Head from "next/head";
import FavoriteRestaurantContainer from "../../containers/favoriteRestaurants/favoriteRestaurantsContainer";
import { Line } from "../../styled-components/etc";
import { MY_PAGE_REVIEWS_PER_QUERY } from "../../constants/policies";

type Params = {
  bobId: string;
};

export const getServerSideProps = async (context: GetServerSidePropsContext<Params>) => {
  const bobId = context.params?.bobId;
  const filteredBobId = bobId?.slice(1);

  const sessionPromise = unstable_getServerSession(context.req, context.res, authOptions);

  const userInfoPromise = prisma.user.findFirst({
    where: {
      bobId: filteredBobId,
    },
    select: {
      id: true,
    },
  });

  const [session, userInfo] = await Promise.all([sessionPromise, userInfoPromise]);

  if (userInfo === null) {
    return {
      notFound: true,
    };
  }

  const userId = userInfo.id;

  const userPromise = prisma.user.findFirst({
    where: {
      bobId: filteredBobId,
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

  // VisitedRestaurants, FavoriteRestaurants 에 리뷰 링크를 걸기 위한 정보
  const reviewPreviewPromise = prisma.reviews.findMany({
    where: {
      userId,
    },
    select: {
      titleLink: true,
      title: true,
      restaurantId: true,
      id: true,
    },
  });

  // Infinite scroll pagination 을 위한 첫 번째 페이지 분량의 리뷰 로드
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
    skip: 0,
    take: MY_PAGE_REVIEWS_PER_QUERY,
  });

  const [user, reviewPreview, reviews] = await Promise.all([
    userPromise,
    reviewPreviewPromise,
    reviewsPromise,
  ]);

  if (user === null) {
    return {
      notFound: true,
    };
  }

  let regions: string[] = [];

  if (user.regions) {
    const userRegions = await prisma.regions.findMany({
      where: {
        id: {
          in: user.regions?.split(",").map(Number),
        },
      },
    });

    regions = userRegions.map((region) => region.region);
  }

  const profile = {
    isOwner: user.id === session?.user.id,
    userId: user.id,
    bobId: user.bobId,
    name: user.nickname,
    image: user.image,
    title: user.title,
    description: user.description,
    visits: user.VisitedRestaurants.length,
    posts: reviews.length,
    regions,
  };

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

  const props = {
    profile,
    reviews: filteredReviews,
    reviewPreview,
    pagination: {
      isLastPage: reviews.length < MY_PAGE_REVIEWS_PER_QUERY,
      page: 1,
    },
  };

  return {
    props,
  };
};

export type ProfilePageProps = InferNextPropsType<typeof getServerSideProps>;

const UserPage = ({ profile, reviews, reviewPreview, pagination }: ProfilePageProps) => {
  const title = `${profile.name} (@${profile.bobId})`;

  return (
    <Body>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={profile.name!} />
        <meta property="og:description" content={profile.title!} />
        <meta property="og:site_name" content="밥사랑 한마음" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={profile.image!} />
        <meta property="og:url" content={`http://localhost:3000/@${profile.bobId}`} />
      </Head>
      <LeftContainer>
        <ProfileContainer {...profile} />
        {profile.isOwner && (
          <>
            <Line marginTop={20} marginBot={20} />
            <CustomizedAccordions
              title="내 주변 음식점 찾아보기"
              TransitionProps={{ unmountOnExit: true }}
            >
              <NearbySearchContainer />
            </CustomizedAccordions>
          </>
        )}
        <Line marginTop={20} marginBot={40} />
        <PostListContainer
          reviews={reviews}
          totalReviews={reviewPreview.length}
          username={profile.name}
          bobId={profile.bobId}
          userId={profile.userId}
          isLastPage={pagination.isLastPage}
        />
      </LeftContainer>
      <RightContainer>
        <MapChartContainer userId={profile.userId} regions={profile.regions} />
        <Line marginTop={20} marginBot={20} />
        <FavoriteRestaurantContainer
          writtenReviews={reviewPreview}
          userName={profile.name}
          userId={profile.userId}
          bobId={profile.bobId}
          isOwner={profile.isOwner}
        />
        <Line marginTop={20} marginBot={20} />
        <VisitedRestaurantsContainer
          writtenReviews={reviewPreview}
          userName={profile.name}
          userId={profile.userId}
          bobId={profile.bobId}
          isOwner={profile.isOwner}
        />
      </RightContainer>
    </Body>
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

export default UserPage;
