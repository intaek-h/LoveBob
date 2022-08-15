import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import styled from "styled-components";
import { lighten } from "polished";
import { useQuery } from "react-query";
import axios from "axios";

import logo from "../../assets/icons/bob-logo.svg";
import { useSession } from "../../lib/sessionCache";

const THREE_HOURS = 60 * 1000 * 60 * 3;
const FIVE_MINUTES = 60 * 1000 * 3;

const Header = () => {
  const router = useRouter();

  const [session] = useSession({
    queryConfig: {
      staleTime: THREE_HOURS,
      refetchInterval: FIVE_MINUTES,
    },
  });
  const { data, isSuccess: isUserDataReady } = useQuery("key", () => axios.get("/api/users"), {
    enabled: !!session,
    staleTime: THREE_HOURS,
    refetchInterval: FIVE_MINUTES,
  });

  if (isUserDataReady)
    return (
      <Container>
        <Image src={logo} alt="logo" onClick={() => router.push("/")} />
        <ProfileIcon onClick={() => router.push(`/users/${data.data.result.id}`)} />
      </Container>
    );

  if (session)
    return (
      <Container>
        <Image src={logo} alt="logo" onClick={() => router.push("/")} />
        <ProfileIcon />
      </Container>
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
  background-color: ${({ theme }) => theme.element.bg_placeholder};
  border-radius: 50%;
  cursor: pointer;
`;

export default Header;
