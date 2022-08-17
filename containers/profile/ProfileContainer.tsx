import { NextPage } from "next";
import { useState } from "react";
import styled from "styled-components";
import Modal from "../../components/profile/Modal";
import type { ServerSideProps } from "../../pages/users/[id]";

type Props = ServerSideProps["profile"];

const ProfileContainer: NextPage<Props> = ({ name, posts, visits, title, description }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Container>
        <div>image</div>
        <div>
          <p>{name}</p>
          <p>
            {posts} 포스트 {visits} 방문한 식당
          </p>
          <p>{title}</p>
          <p>{description}</p>
        </div>
        <Setting onClick={() => setIsModalOpen(true)}>프로필 수정하기</Setting>
        <Modal onClose={() => setIsModalOpen(false)} show={isModalOpen} />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 680px;
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 0 auto;
  background-color: aliceblue;
`;

const Setting = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`;

export default ProfileContainer;
