import styled from "styled-components";
import { ErrorMsg, SuccessMsg } from "../../styled-components/texts";
import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  NICKNAME_REGEX_PATTERN,
  BOB_ID_MAX_LENGTH,
  BOB_ID_MIN_LENGTH,
  BOB_ID_REGEX_PATTERN,
} from "../../constants/policies";
import { SubmitHandler, useForm } from "react-hook-form";
import { TitleInput } from "../../styled-components/inputs";
import { Dispatch, SetStateAction } from "react";
import ProfileService from "../../services/ProfileService";
import { PaddedButton } from "../../styled-components/buttons";
import { darken } from "polished";
import { ValidInputs } from ".";

interface Props {
  validInputs: ValidInputs;
  setValidInputs: Dispatch<SetStateAction<ValidInputs>>;
}

export type Inputs = {
  nickname: string;
  bobId: string;
};

const InputForm = ({ validInputs, setValidInputs }: Props) => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<Inputs>({ defaultValues: { nickname: "", bobId: "" }, mode: "onChange" });

  const resetForm = () => {
    setValidInputs((prev) => ({ ...prev, bobId: "", nickname: "" }));
    reset();
  };

  const onSubmit: SubmitHandler<Inputs> = async ({ nickname, bobId }) => {
    try {
      const response = await ProfileService.checkDuplicateUserIdAndNickName({
        nickname,
        bobId,
      });

      if (!response.success && response.message?.includes("이름")) {
        return setError("nickname", { type: "dup-nickname", message: response.message });
      }

      if (!response.success && response.message?.includes("아이디")) {
        return setError("bobId", { type: "dup-bobId", message: response.message });
      }

      if (!response.success) {
        setError("nickname", { type: "dup-nickname", message: response.message });
        setError("bobId", { type: "dup-bobId", message: response.message });
        return;
      }

      setValidInputs((prev) => ({ ...prev, nickname, bobId }));
    } catch (error) {
      setError("nickname", { type: "dup-nickname", message: "요청에 실패했습니다" });
      setError("bobId", { type: "dup-bobId", message: "요청에 실패했습니다" });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Header>
        <h1>환영합니다!</h1>
        <span>
          앞으로의 활동을 위한 <strong>이름</strong>과 <strong>아이디</strong>를 설정해주세요
        </span>
      </Header>

      <InputContainer>
        <label htmlFor="nickname">이름</label>
        <Guide>한글, 영어(대소문자 구분), 숫자를 포함할 수 있습니다</Guide>
        <TitleInput
          {...register("nickname", {
            minLength: NICKNAME_MIN_LENGTH,
            maxLength: NICKNAME_MAX_LENGTH,
            required: true,
            pattern: NICKNAME_REGEX_PATTERN,
          })}
          type="text"
          id="nickname"
          placeholder="예) 햄없는볶음밥"
          autoComplete="off"
          maxLength={NICKNAME_MAX_LENGTH}
          disabled={!!validInputs.bobId && !!validInputs.nickname}
        />
        {errors.nickname?.type === "pattern" && (
          <ErrorMsg>한글, 영어 대문자, 소문자와 숫자만 사용할 수 있습니다</ErrorMsg>
        )}
        {errors.nickname?.type === "minLength" && (
          <ErrorMsg>최소 {NICKNAME_MIN_LENGTH} 자 이상이어야 합니다</ErrorMsg>
        )}
        {errors.nickname?.type === "maxLength" && (
          <ErrorMsg>최대 {NICKNAME_MAX_LENGTH} 자 이하여야 합니다</ErrorMsg>
        )}
        {errors.nickname?.type === "required" && <ErrorMsg>이름은 필수 항목입니다</ErrorMsg>}
        {errors.nickname?.type === "dup-nickname" && <ErrorMsg>{errors.nickname.message}</ErrorMsg>}
      </InputContainer>

      <InputContainer>
        <label htmlFor="bobId">아이디</label>
        <Guide>영어(대소문자 구분), 숫자를 포함할 수 있습니다</Guide>
        <TitleInput
          {...register("bobId", {
            minLength: BOB_ID_MIN_LENGTH,
            maxLength: BOB_ID_MAX_LENGTH,
            required: true,
            pattern: BOB_ID_REGEX_PATTERN,
          })}
          type="text"
          id="bobId"
          placeholder="예) hamKiller007"
          autoComplete="off"
          spellCheck="false"
          maxLength={BOB_ID_MAX_LENGTH}
          disabled={!!validInputs.bobId && !!validInputs.nickname}
        />
        {errors.bobId?.type === "pattern" && (
          <ErrorMsg>영어 대문자, 소문자와 숫자만 사용할 수 있습니다</ErrorMsg>
        )}
        {errors.bobId?.type === "minLength" && (
          <ErrorMsg>최소 {BOB_ID_MIN_LENGTH} 자 이상이어야 합니다</ErrorMsg>
        )}
        {errors.bobId?.type === "maxLength" && (
          <ErrorMsg>최대 {BOB_ID_MAX_LENGTH} 자 이하여야 합니다</ErrorMsg>
        )}
        {errors.bobId?.type === "required" && <ErrorMsg>아이디는 필수 항목입니다</ErrorMsg>}
        {errors.bobId?.type === "dup-bobId" && <ErrorMsg>{errors.bobId.message}</ErrorMsg>}
      </InputContainer>

      <CheckButton disabled={!isValid}>중복 확인하기</CheckButton>
      <ResetButton onClick={resetForm}>
        다시 하기 <span className="material-symbols-outlined">restart_alt</span>
      </ResetButton>
      {validInputs.bobId && validInputs.nickname && (
        <SuccessMessage>중복된 ID 또는 이름이 없습니다</SuccessMessage>
      )}
    </Form>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;

  h1 {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  span {
    font-weight: 300;
  }
`;

const Guide = styled.span`
  font-size: 0.9rem;
  font-weight: 300;
  color: ${({ theme }) => theme.text.monochrome_5};
  margin-bottom: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 120px;
  margin-bottom: 20px;

  label {
    margin-bottom: 5px;
    font-weight: 500;
  }

  input {
    margin-bottom: 5px;

    :disabled {
      color: ${({ theme }) => theme.text.monochrome_2};
    }
  }
`;

const Form = styled.form`
  margin-top: 100px;
  width: 100%;
`;

const CheckButton = styled(PaddedButton)`
  display: inline;
  width: 200px;
  height: 40px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${({ theme }) => theme.element.green_prism_3};
  color: ${({ theme }) => theme.text.monochrome_1};

  :hover {
    background-color: ${({ theme }) => darken(0.02, theme.element.green_prism_3)};
  }

  :disabled {
    background-color: ${({ theme }) => theme.element.monochrome_2};
  }
`;

const ResetButton = styled.span`
  font-size: 0.8rem;
  margin-left: 20px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  & > span {
    vertical-align: middle;
    font-size: 0.95rem;
  }
`;

const SuccessMessage = styled(SuccessMsg)`
  margin-left: 20px;
`;

export default InputForm;
