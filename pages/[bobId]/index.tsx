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

type Params = {
  bobId: string;
};

export type WrittenReviews = {
  id: string;
  restaurantId: string;
  titleLink: string;
  title: string;
}[];

export const getServerSideProps = async (context: GetServerSidePropsContext<Params>) => {
  const bobId = context.params?.bobId;
  const filteredBobId = bobId?.slice(1);

  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  const user = await prisma.user.findFirst({
    where: {
      bobId: filteredBobId,
    },
    include: {
      Reviews: {
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
      },
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
    posts: user.Reviews.length,
    regions,
  };

  const filteredReviews = user?.Reviews.map((review, i) => ({
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
  };

  return {
    props,
  };
};

export type ServerSideProps = InferNextPropsType<typeof getServerSideProps>;

const UserPage = ({ profile, reviews }: ServerSideProps) => {
  const writtenReviews: WrittenReviews = reviews.map((review) => ({
    id: review.id,
    restaurantId: review.restaurantId,
    titleLink: review.titleLink,
    title: review.title,
  }));

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
        <Line marginTop={20} marginBot={20} />
        <PostListContainer reviews={reviews} username={profile.name} bobId={profile.bobId} />
      </LeftContainer>
      <RightContainer>
        <MapChartContainer userId={profile.userId} regions={profile.regions} />
        <Line marginTop={20} marginBot={20} />
        <FavoriteRestaurantContainer
          writtenReviews={writtenReviews}
          userName={profile.name}
          userId={profile.userId}
          bobId={profile.bobId}
          isOwner={profile.isOwner}
        />
        <Line marginTop={20} marginBot={20} />
        <VisitedRestaurantsContainer
          writtenReviews={writtenReviews}
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

const LeftContainer = styled.div`
  width: 700px;
`;

const RightContainer = styled.div`
  width: 450px;
`;

export default UserPage;
