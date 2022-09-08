import styled from "styled-components";
import ImageUploader from "./ImageUploader";
import ProfileChangeForm from "./ProfileChangeForm";

interface Props {
  closeModal: () => void;
}

const ProfileEditor = ({ closeModal }: Props) => {
  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <Container>
      <Header>프로필 설정</Header>
      <Body>
        <ImageContainer>
          <ImageUploader />
        </ImageContainer>
        <Line />
        <ProfileChangeForm />
        <CloseButton onClick={handleCloseClick}>X</CloseButton>
      </Body>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  background: white;
  width: 800px;
  height: 600px;
  border-radius: 3px;
  padding: 30px;
`;

const Body = styled.div`
  display: flex;
  justify-content: space-between;
  height: calc(100% - 60px);
  padding: 0 20px;
`;

const Header = styled.div`
  display: block;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 20px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 45%;
`;

const Line = styled.div`
  height: 100%;
  border-left: 1px solid ${({ theme }) => theme.element.monochrome_2};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 25px;
  right: 25px;
  box-sizing: border-box;
  appearance: none;
  border: none;
  border-radius: 4px;
  background: none;
  padding: 0;
  width: 32px;
  height: 32px;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.element.placeholder};
  }
`;

export default ProfileEditor;
