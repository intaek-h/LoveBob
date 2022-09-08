import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import Modal from "../../components/modal";
import ProfileEditor from "../../components/profile/ProfileEditor";
import { useSession } from "../../hooks/queryHooks/useSession";
import type { ServerSideProps } from "../../pages/users/[id]";

type Props = ServerSideProps["profile"];

const ProfileContainer = ({ isOwner, name, image, posts, visits, title, description }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [session] = useSession();

  return (
    <>
      <Container>
        <ProfileImageContainer>
          {image && <ProfileImage src={image} width="150" height="150" alt="profile-image" />}
        </ProfileImageContainer>

        <ProfileTextContainer>
          <Name>{name}</Name>
          <span>포스트 </span>
          <BoldContent>{posts}</BoldContent>
          <span style={{ marginLeft: 30 }}>방문한 곳 </span>
          <BoldContent>{visits}</BoldContent>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </ProfileTextContainer>
        {isOwner && session && (
          <>
            <Setting onClick={() => setIsModalOpen(true)}>편집</Setting>
            <Modal show={isModalOpen}>
              <ProfileEditor closeModal={() => setIsModalOpen(false)} />
            </Modal>
          </>
        )}
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
`;

const ProfileImageContainer = styled.div`
  width: 200px;
  height: 200px;
`;

const ProfileImage = styled(Image)`
  border-radius: 50%;
`;

const ProfileTextContainer = styled.div`
  width: 500px;
`;

const Name = styled.span`
  display: block;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 15px;
`;

const BoldContent = styled.span`
  display: inline-block;
  margin-bottom: 30px;
  font-weight: 500;
`;

const Title = styled.span`
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.span`
  line-height: 1.6rem;
`;

const Setting = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.9rem;
  color: #b8b8b8;
  cursor: pointer;
`;

export default ProfileContainer;
