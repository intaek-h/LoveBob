import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const UserPage: NextPage = () => {
  return (
    <div>
      <span>hi</span>
    </div>
  );
};

export default UserPage;
