import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import styled from "styled-components";
import CustomizedAccordions from "../../../components/accordion";
import NearbySearchContainer from "../../../containers/nearbySearch/NearbySearchContainer";
import MapChartContainer from "../../../containers/mapChart/MapChartContainer";
import ProfileContainer from "../../../containers/profile/ProfileContainer";
import VisitedRestaurantsContainer from "../../../containers/visitedRestaurants/visitedRestaurantsContainer";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../api/auth/[...nextauth]";

type Params = {
  id: string;
};

export const getServerSideProps = async (context: GetServerSidePropsContext<Params>) => {
  const userId = context.params?.id;

  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      Posts: true,
      VisitedRestaurants: {
        include: {
          restaurant: {
            select: {
              _count: {
                select: { Posts: true },
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

  const filteredVisitedRestaurants = user?.VisitedRestaurants.map((record) => ({
    name: `${record.restaurant.poi_nm} ${record.restaurant.branch_nm} ${record.restaurant.sub_nm}`,
    city: `${record.restaurant.sido_nm} ${record.restaurant.sgg_nm}`,
    roadAddress: `${record.restaurant.rd_nm} ${record.restaurant.bld_num}`,
    category: record.restaurant.mcate_nm,
    posts: record.restaurant._count.Posts,
    id: record.restaurantsId,
  }));

  const props = {
    profile: {
      isOwner: user?.id === session?.userId,
      id: user?.id,
      name: user?.name,
      image: user?.image,
      title: user?.title,
      description: user?.description,
      visits: user?.VisitedRestaurants.length,
      posts: user?.Posts.length,
    },
    visitedRestaurants: filteredVisitedRestaurants,
    posts: user?.Posts,
  };

  return {
    props,
  };
};

export type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserPage = ({ profile, visitedRestaurants }: ServerSideProps) => {
  return (
    <Body>
      <LeftContainer>
        <ProfileContainer {...profile} />
        <Line margin={40} />
        <CustomizedAccordions>
          <NearbySearchContainer />
        </CustomizedAccordions>
      </LeftContainer>
      <RightContainer>
        <MapChartContainer />
        <VisitedRestaurantsContainer restaurants={visitedRestaurants} userName={profile.name} />
      </RightContainer>
    </Body>
  );
};

interface LineProps {
  margin?: number;
}

const Body = styled.div`
  display: flex;
  justify-content: space-around;
`;

const LeftContainer = styled.div`
  width: 700px;
`;

const RightContainer = styled.div`
  width: 500px;
`;

export const Line = styled.div<LineProps>`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.element.placeholder};
  margin: ${(props) => props.margin || 0}px 0;
`;

export default UserPage;
