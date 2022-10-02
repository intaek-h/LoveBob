import Image from "next/image";
import { forwardRef, Ref } from "react";
import styled from "styled-components";
import { ProfilePageProps } from "../../../pages/[bobId]";
import { formatDate } from "../../../utils/formatDate";
import { generateResizedUrl } from "../../../utils/generateResizedUrl";

interface Props {
  review: ProfilePageProps["reviews"][number];
  handleClick: () => void;
}

const GeneralReviewContainer = ({ review, handleClick }: Props, ref: Ref<HTMLDivElement>) => {
  return (
    <Container ref={ref} onClick={handleClick}>
      <TextContainer>
        <TitleContainer>
          {review.type === "식당 리뷰" && (
            <RestaurantAddress>
              {review.restaurant}
              {review.isFavorite && (
                <>
                  <span> · </span>
                  <FavoriteTag title="작성자가 선택한 맛집입니다">
                    맛집 <Check className="material-symbols-outlined">check</Check>
                  </FavoriteTag>
                </>
              )}
            </RestaurantAddress>
          )}
          <Title>{review.title}</Title>
          <Preview>{review.preview}</Preview>
        </TitleContainer>
        <PostInfoContainer>
          <span>{formatDate(review.createdAt)}</span>
          <span> · </span>
          <span>{review.type}</span>
          <span> · </span>
          <span>{review.likeCount} 개의 추천</span>
          <span> · </span>
          <span>{review.commentCount} 개의 댓글</span>
        </PostInfoContainer>
      </TextContainer>
      {review.imageUrl ? (
        <ThumbnailContainer>
          <Thumbnail
            src={generateResizedUrl(review.imageUrl, "medium")}
            alt="preview-image"
            width="100px"
            height="100px"
            objectFit="cover"
          />
        </ThumbnailContainer>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 120px);
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RestaurantAddress = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.monochrome_4};
  margin-bottom: 4px;
`;

const FavoriteTag = styled.span`
  color: ${({ theme }) => theme.text.highlight_blue};
`;

const Check = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  vertical-align: top;
`;

const Title = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Preview = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: ${({ theme }) => theme.text.monochrome_4};
  margin-bottom: 10px;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const PostInfoContainer = styled.div`
  & > span {
    color: ${({ theme }) => theme.text.monochrome_4};
    font-weight: 400;
    font-size: 0.9rem;
  }

  & :nth-child(3) {
    font-weight: 600;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Thumbnail = styled(Image)`
  border-radius: 3px;
`;

export default forwardRef(GeneralReviewContainer);
