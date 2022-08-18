import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Image from "next/image";
import styled from "styled-components";
import { lighten } from "polished";
import { useQuery } from "react-query";
import axios from "axios";

import logo from "../../assets/icons/bob-logo.svg";
import { SESSION_REFETCH_INTERVAL, SESSION_STALE_TIME, useSession } from "../../hooks/useSession";

const Header = () => {
  const router = useRouter();

  const [session] = useSession();

  const { data } = useQuery("key", () => axios.get("/api/users"), {
    enabled: !!session,
    staleTime: SESSION_STALE_TIME,
    refetchInterval: SESSION_REFETCH_INTERVAL,
  });

  if (data?.data.success)
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
  margin-bottom: 40px;
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
