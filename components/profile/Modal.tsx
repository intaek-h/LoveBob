import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "../../hooks/useSession";
import axios from "axios";
import { useRouter } from "next/router";
import ImageUploader from "./ImageUploader";

interface Props {
  show: boolean;
  onClose: () => void;
}

type Inputs = {
  title: string;
  description: string;
};

const Modal = ({ show, onClose }: Props) => {
  const [isBrowser, setIsBrowser] = useState(false);

  const [session] = useSession();
  const { query } = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Inputs>({ defaultValues: { description: "", title: "" } });

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    const { data } = await axios.put(`/api/users/${query.id}`, { ...inputs, type: "description" });

    if (data.success) {
      reset();
    }
  };

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
    reset();
  };

  const modalContent =
    show && session ? (
      <Overlay>
        <Container>
          <Header>프로필 설정</Header>
          <Body>
            <ImageContainer>
              <ImageUploader />
            </ImageContainer>
            <Line />
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
              <form>
                <InputContainer>
                  <label>한 줄 소개</label>
                  <input {...register("title", { maxLength: 30 })} type="text" />
                  {errors.title?.type === "maxLength" && (
                    <span>서른자 이상을 넘을 수 없습니다</span>
                  )}
                </InputContainer>

                <InputContainer>
                  <label>소개글</label>
                  <textarea {...register("description", { maxLength: 140 })} />
                  {errors.description?.type === "maxLength" && (
                    <span>140 자 이상을 넘을 수 없습니다</span>
                  )}
                </InputContainer>

                <SaveButton type="submit" disabled={!isDirty}>
                  저장
                </SaveButton>
              </form>
            </FormContainer>
          </Body>
          <CloseButton onClick={handleCloseClick}>X</CloseButton>
        </Container>
      </Overlay>
    ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById("modal")!);
  } else {
    return null;
  }
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

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
  font-weight: 500;
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
  border-left: 1px solid ${({ theme }) => theme.element.bg_placeholder};
`;

const FormContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 30px;

  label {
    margin-bottom: 5px;
    font-weight: 500;
  }

  input,
  textarea {
    font-size: 0.95rem;
    width: 100%;
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.element.bg_placeholder};
    border-radius: 4px;
  }

  input {
  }

  textarea {
    height: 100px;
    resize: none;
  }
`;

const SaveButton = styled.button`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  appearance: none;
  border: none;
  border-radius: 4px;
  background: none;
  cursor: pointer;
  background-color: #2da44e;
  color: #fff;

  :disabled {
    background-color: ${({ theme }) => theme.element.bg_placeholder};
  }
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
    background-color: ${({ theme }) => theme.element.bg_placeholder};
  }
`;

export default Modal;
