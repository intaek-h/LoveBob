import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import styled from "styled-components";
import CustomizedAccordions from "../../../components/accordion";
import NearbySearch from "../../../components/search/NearbySearch";
import NearbySearchContainer from "../../../components/search/NearbySearchContainer";
import MapChartContainer from "../../../containers/mapChart/MapChartContainer";
import ProfileContainer from "../../../containers/profile/ProfileContainer";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../api/auth/[...nextauth]";

type Params = {
  id: string;
};

export const getServerSideProps = async (context: GetServerSidePropsContext<Params>) => {
  const param = context.params?.id;

  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  const user = await prisma.user.findFirst({
    where: {
      id: param,
    },
    include: {
      Posts: true,
      VisitedRestaurants: {
        where: {
          userId: param,
        },
        include: {
          restaurant: true,
        },
      },
    },
  });

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
    visitedRestaurants: user?.VisitedRestaurants,
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

const Line = styled.div<LineProps>`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.element.bg_placeholder};
  margin: ${(props) => props.margin || 0}px 0;
`;

export default UserPage;
