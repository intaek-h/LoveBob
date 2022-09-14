import { useEffect, useState } from "react";
import styled from "styled-components";
import { useBoundStore } from "../../store";
import { useSession } from "../../hooks/queryHooks/useSession";
import ReviewService from "../../services/ReviewService";
import { ImageObject } from "../../store/reviewEditorSlice";
import { PaddedLabel } from "../../styled-components/buttons";
import { ErrorMsg } from "../../styled-components/texts";

interface Props {
  restaurantId: string;
}

const MAX_IMAGE_COUNT = 5;
const MAX_SINGLE_IMAGE_SIZE = 5000000;

const MultipleImageUploader = ({ restaurantId }: Props) => {
  const images = useBoundStore((state) => state.images);
  const setImages = useBoundStore((state) => state.updateImages);
  const emptyImages = useBoundStore((state) => state.emptyImages);
  const deleteImage = useBoundStore((state) => state.deleteImage);

  const [session] = useSession();
  const [isTransforming, setIsTransforming] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files?.length) return;
    if (images.length === MAX_IMAGE_COUNT) {
      setIsTransforming(false);
      return setError(`최대 ${MAX_IMAGE_COUNT} 개 까지 첨부할 수 있습니다`);
    }

    setIsTransforming(true);
    setError("");

    const img = new Image();
    const file = e.target.files[0];

    if (file.size > MAX_SINGLE_IMAGE_SIZE) {
      e.target.value = "";
      setIsTransforming(false);
      return setError("5mb 를 초과할 수 없습니다");
    }

    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      try {
        const { base64, blob } = transformImage(img);

        const { result: presignedUrl } = await ReviewService.getPresignedUrl(
          restaurantId,
          session.user.id
        );

        await ReviewService.uploadImageToPresignedUrl(presignedUrl!, blob);

        const url = new URL(presignedUrl!);
        const s3Location = url.origin + url.pathname;
        const imageObject: ImageObject = { dataUrl: base64, url: s3Location };

        setImages(imageObject);
      } catch (error) {
        setError("이미지 처리중 오류가 발생했습니다");
      }

      setIsTransforming(false);
    };
    img.onerror = () => {
      setIsTransforming(false);
      setError("이미지 처리중 오류가 발생했습니다");
    };
  };

  const handleImageDelete = (index: number) => () => {
    deleteImage(index);
  };

  useEffect(() => {
    return () => emptyImages();
  }, [emptyImages]);

  return (
    <>
      <div>
        <Label>
          <div>
            <LabelText>사진 </LabelText>
            <ImageCount>
              ({images.length} / {MAX_IMAGE_COUNT})
            </ImageCount>
          </div>
          <DeleteAll onClick={emptyImages}>전체 삭제</DeleteAll>
        </Label>
        <UploadButton htmlFor="image-uploader">첨부하기</UploadButton>
        <input
          type="file"
          id="image-uploader"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImageUpload}
          disabled={isTransforming}
          style={{ display: "none" }}
        />
      </div>
      <div>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Gallery>
          {images.map((image, i) => (
            <ImageContainer key={i}>
              <UploadedImage src={image.dataUrl} alt="uploaded-image" width="100%" />
              <DeleteButton onClick={handleImageDelete(i)}>제거</DeleteButton>
            </ImageContainer>
          ))}
        </Gallery>
      </div>
    </>
  );
};

function transformImage(image: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(image, 0, 0);

  const transformedImage = canvas.toDataURL("image/webp", 0.9);
  const imageBuffer = Buffer.from(
    transformedImage.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  return { base64: transformedImage, blob: imageBuffer };
}

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const LabelText = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;

const ImageCount = styled(LabelText)`
  font-weight: 400;
`;

const DeleteAll = styled.span`
  font-size: 0.8rem;
  text-decoration: underline;
  color: ${({ theme }) => theme.text.highlight_blue};
  cursor: pointer;
`;

const UploadButton = styled(PaddedLabel)`
  padding: 7px 0;
  margin-bottom: 15px;
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ImageContainer = styled.div`
  width: 50%;
  padding: 10px;
  position: relative;
`;

const UploadedImage = styled.img`
  border: 1px solid ${({ theme }) => theme.element.monochrome_2};
  border-radius: 4px;
`;

const DeleteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  font-size: 0.8rem;
  color: transparent;
  cursor: pointer;

  &:hover {
    backdrop-filter: invert(20%);
    color: #ffffff;
  }
`;

export default MultipleImageUploader;
