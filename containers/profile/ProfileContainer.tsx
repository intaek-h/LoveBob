import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import Modal from "../../components/modal";
import ProfileEditor from "../../components/profile/ProfileEditor";
import { useSession } from "../../hooks/queryHooks/useSession";
import type { ServerSideProps } from "../../pages/[bobId]";

type Props = ServerSideProps["profile"];

const ProfileContainer = ({
  isOwner,
  name,
  image,
  posts,
  visits,
  title,
  description,
  bobId,
}: Props) => {
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
          <UserId>@{bobId}</UserId>
          <span>포스트 </span>
          <BoldContent>{posts}</BoldContent>
          <span style={{ marginLeft: 30 }}>방문한 곳 </span>
          <BoldContent>{visits}</BoldContent>
          <div>
            <Title>{title}</Title>
          </div>
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
      {description && (
        <DescriptionContainer>
          <p>{`"${description}"`}</p>
        </DescriptionContainer>
      )}
    </>
  );
};

const Container = styled.section`
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

const UserId = styled.span`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.text.monochrome_3};
`;

const BoldContent = styled.span`
  display: inline-block;
  margin-bottom: 30px;
  font-weight: 500;
`;

const Title = styled.p`
  display: block;
  font-weight: bold;
  margin: 0;
  margin-bottom: 10px;
`;

const Setting = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.monochrome_3};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const DescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 3px;
  padding-left: 10px;
  font-style: italic;
  background-color: ${({ theme }) => theme.element.green_prism_1};
  color: ${({ theme }) => theme.text.monochrome_4};

  & > p {
    margin: 0;
  }
`;

export default ProfileContainer;
