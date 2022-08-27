import axios from "axios";
import { useRouter } from "next/router";
import { darken } from "polished";
import React, { useState, useRef } from "react";
import { FixedCropper, ImageRestriction, FixedCropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import styled from "styled-components";

const ONE_MEGABYTE = 1000000;

const ImageUploader = () => {
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSucess] = useState("");

  const cropperRef = useRef<FixedCropperRef>(null);

  const { query } = useRouter();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files?.length) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    setError("");
    setSucess("");

    if (file.size > ONE_MEGABYTE) {
      e.target.value = "";

      return setError("1mb 를 초과할 수 없습니다");
    }

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = e.target?.result as string;
      const type = img?.split(";")[0].split("/")[1];

      if (type !== "jpeg" && type !== "png" && type !== "webp") {
        return setError("JPEG PNG WEBP 형식이 아닙니다");
      }

      setImage(img);
    };
  };

  const handleUpload = async () => {
    if (cropperRef.current) {
      setError("");

      const croppedImage = cropperRef.current.getCanvas()?.toDataURL("image/webp", 0.8);

      const { data } = await axios.put(`/api/users/${query.id}`, {
        type: "image",
        image: croppedImage,
      });

      if (!data.success) return setError("요청을 실패했습니다");

      setImage("");
      setSucess("프로필 이미지를 변경했습니다");
    }
  };

  return (
    <>
      <Container>
        <Header>프로필 이미지 변경</Header>
        <FixedCropper
          ref={cropperRef}
          src={image}
          style={{ width: "100%", height: 300 }}
          stencilProps={{
            handlers: false,
            lines: false,
            movable: false,
            resizable: false,
          }}
          stencilSize={{
            width: 300,
            height: 300,
          }}
          imageRestriction={ImageRestriction.stencil}
        />
        {error && <Error>{error}</Error>}
        {success && <Success>{success}</Success>}
        <Label htmlFor="image">이미지 첨부하기</Label>
        <Input
          type="file"
          id="image"
          onChange={handleFileInput}
          accept="image/png, image/jpeg, image/webp"
        />
      </Container>
      <Button disabled={!image} onClick={handleUpload}>
        프로필 변경하기
      </Button>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const Label = styled.label`
  display: block;
  text-align: center;
  color: #777777;
  padding: 10px;
  border-radius: 3px;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: ${() => darken(0.2, "#777777")};
  }
`;

const Input = styled.input`
  display: none;
`;

const Error = styled.span`
  font-size: 0.7rem;
  color: red;
`;

const Success = styled.span`
  font-size: 0.7rem;
  color: #2da44e;
`;

const Button = styled.button`
  appearance: none;
  border: none;
  border-radius: 4px;
  color: #fff;
  width: 100%;
  padding: 10px;
  bottom: 0;
  background-color: #2da44e;
  cursor: pointer;

  :disabled {
    background-color: ${({ theme }) => theme.element.placeholder};
  }
`;

export default ImageUploader;
