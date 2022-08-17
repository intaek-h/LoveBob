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
      title: user?.title,
      description: user?.description,
      visits: user?.VisitedRestaurants.length,
      posts: user?.Posts.length,
    },
  };

  return {
    props,
  };
};

export type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserPage = ({ profile }: ServerSideProps) => {
  return (
    <Container>
      <ProfileContainer {...profile} />
    </Container>
  );
};

const Container = styled.div``;

export default UserPage;
