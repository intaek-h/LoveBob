import { useRouter } from "next/router";
import { darken } from "polished";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { useSession } from "../../hooks/queryHooks/useSession";
import ProfileService from "../../services/ProfileService";
import { PaddedButton } from "../../styled-components/buttons";
import { InputContainer } from "../../styled-components/inputs";
import { ErrorMsg, SuccessMsg } from "../../styled-components/texts";

export type Inputs = {
  title: string;
  description: string;
};

const ProfileChangeForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Inputs>({ defaultValues: { description: "", title: "" } });

  const [session] = useSession();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    try {
      const response = await ProfileService.changeProfileText({
        title: inputs.title,
        description: inputs.description,
        type: "description",
        userId: session.user.id,
      });

      if (response.success) {
        reset();
        setMessage("프로필을 변경했습니다");
      }
    } catch (error) {
      setError("요청을 실패했습니다");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <form>
        <InputContainer>
          <label>한 줄 소개</label>
          <input {...register("title", { maxLength: 30 })} type="text" />
          {errors.title?.type === "maxLength" && <span>서른자 이상을 넘을 수 없습니다</span>}
        </InputContainer>

        <InputContainer>
          <label>소개글</label>
          <textarea {...register("description", { maxLength: 140 })} />
          {errors.description?.type === "maxLength" && <span>140 자 이상을 넘을 수 없습니다</span>}
        </InputContainer>
        {message && <SuccessMsg>{message}</SuccessMsg>}
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <SaveButton type="submit" disabled={!isDirty}>
          소개 변경하기
        </SaveButton>
      </form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const SaveButton = styled(PaddedButton)`
  position: absolute;
  bottom: 0;
  padding: 10px 0;
  background-color: ${({ theme }) => theme.element.green_prism_4};
  color: ${({ theme }) => theme.text.monochrome_1};

  :hover {
    background-color: ${({ theme }) => darken(0.02, theme.element.green_prism_4)};
  }

  :disabled {
    border-color: ${({ theme }) => theme.element.placeholder};
    background-color: ${({ theme }) => theme.element.placeholder};
  }
`;

export default ProfileChangeForm;
