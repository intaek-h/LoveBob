import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import styled from "styled-components";
import ProfileContainer from "../../../containers/profile/ProfileContainer";
import prisma from "../../../lib/prisma";

type Params = {
  id: string;
};

export const getServerSideProps = async (context: GetServerSidePropsContext<Params>) => {
  const param = context.params?.id;

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
      </LeftContainer>
      <RightContainer></RightContainer>
    </Body>
  );
};

interface LineProps {
  margin?: number;
}

const Body = styled.div`
  display: flex;
  justify-content: center;
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
