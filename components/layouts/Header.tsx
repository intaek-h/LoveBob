import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import styled from "styled-components";
import { lighten } from "polished";
import logo from "../../public/images/icons/bob-logo.svg";
import { useSession } from "../../hooks/queryHooks/useSession";
import Modal from "../modal";
import { useState } from "react";
import OnboardForm from "../onboard";

const Header = () => {
  const router = useRouter();
  const [session] = useSession();
  const [isModalOpen, setIsModalOpen] = useState(true);

  if (session?.user.bobId && session?.user.nickname)
    return (
      <Container>
        <Image src={logo} alt="logo" onClick={() => router.push("/")} />
        <button onClick={() => signOut()}>log out</button>
        <ProfileIcon onClick={() => router.push(`/@${session.user.bobId}`)} />
      </Container>
    );

  if (session)
    return (
      <>
        <Container>
          <Image src={logo} alt="logo" onClick={() => router.push("/")} />
          <ProfileIcon />
        </Container>
        <Modal show={isModalOpen}>
          <OnboardForm closeModal={() => setIsModalOpen(false)} />
        </Modal>
      </>
    );

  return (
    <Container>
      <Image src={logo} alt="logo" onClick={() => router.push("/")} />
      <LoginButton onClick={() => signIn("google")}>가입 또는 로그인</LoginButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 15px 20px;
`;

const LoginButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

  :hover {
    color: ${({ theme }) => lighten(0.3, theme.text.default)};
  }
`;

const ProfileIcon = styled.button`
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.element.placeholder};
  border-radius: 50%;
  cursor: pointer;
`;

export default Header;
