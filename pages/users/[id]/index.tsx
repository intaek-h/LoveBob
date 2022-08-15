import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
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

  return {
    props: { user },
  };
};

type ServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const UserPage = ({ user }: ServerSideProps) => {
  if (!user) return <div>Not Found</div>;

  return (
    <div>
      <span>{user?.id}</span>
      <span>{user?.email}</span>
    </div>
  );
};

export default UserPage;
