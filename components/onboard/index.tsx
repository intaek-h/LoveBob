import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { darken } from "polished";
import { useState } from "react";
import styled from "styled-components";
import { useSession } from "../../hooks/queryHooks/useSession";
import ProfileService from "../../services/ProfileService";
import { PaddedButton } from "../../styled-components/buttons";
import { Line } from "../../styled-components/etc";
import { ErrorMsg } from "../../styled-components/texts";
import InputForm from "./InputForm";
import RegionForm from "./RegionForm";

interface Props {
  closeModal: () => void;
}

export type Inputs = {
  nickname: string;
  bobId: string;
};

export interface ValidInputs {
  bobId: string;
  nickname: string;
  regions: number[];
}

const OnboardForm = ({ closeModal }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [session] = useSession();
  const [error, setError] = useState("");
  const [validInputs, setValidInputs] = useState<ValidInputs>({
    bobId: "",
    nickname: "",
    regions: [],
  });

  const handleSubmit = async () => {
    try {
      const response = await ProfileService.addBobIdAndNickName({
        id: session.user.id,
        bobId: validInputs.bobId,
        nickname: validInputs.nickname,
        regions: validInputs.regions,
      });

      if (response.success) {
        queryClient.invalidateQueries(["session"]);
        router.push(`/@${validInputs.bobId}`);
        return;
      }
    } catch (error) {}

    setError("요청에 실패했습니다");
  };

  return (
    <Container>
      <InputForm validInputs={validInputs} setValidInputs={setValidInputs} />
      <Line marginBot={40} marginTop={40} />
      <RegionForm regionIds={validInputs.regions} setValidInputs={setValidInputs} />
      <Line marginBot={40} marginTop={20} />
      <SaveButtonContainer>
        <div>
          <SaveButton disabled={!validInputs.bobId || !validInputs.nickname} onClick={handleSubmit}>
            제출하기
          </SaveButton>
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </div>
        <LogOutButton onClick={() => signOut()}>로그아웃</LogOutButton>
      </SaveButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 900px;
  height: 800px;
  padding: 20px 50px;
  background-color: white;
  overflow-y: scroll;
`;

const SaveButton = styled(PaddedButton)`
  display: inline;
  width: 200px;
  padding: 12px 40px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 20px;
  background-color: ${({ theme }) => theme.element.blue_prism_4};
  color: ${({ theme }) => theme.text.monochrome_1};

  :hover {
    background-color: ${({ theme }) => darken(0.02, theme.element.blue_prism_4)};
  }

  :disabled {
    background-color: ${({ theme }) => theme.element.monochrome_2};
  }
`;

const SaveButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 40px;
`;

const LogOutButton = styled.span`
  font-size: 0.8rem;
  margin-right: 20px;
  color: ${({ theme }) => theme.text.monochrome_4};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

export default OnboardForm;
