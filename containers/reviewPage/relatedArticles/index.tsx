import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import useTopReviewsOfRestaurant from "../../../hooks/queryHooks/useTopReviewsOfRestaurant";
import { PostPageStaticProps } from "../../../pages/[bobId]/[titleLink]";
import { Line } from "../../../styled-components/etc";
import { formatDate } from "../../../utils/formatDate";
import { generateResizedUrl } from "../../../utils/generateResizedUrl";

interface Props {
  restaurantId: PostPageStaticProps["restaurant"]["id"];
  restaurantName: PostPageStaticProps["restaurant"]["name"];
  reviewId: PostPageStaticProps["review"]["id"];
}

const RelatedArticles = ({ restaurantId, restaurantName, reviewId }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError } = useTopReviewsOfRestaurant(restaurantId, reviewId);

  const handleLinkClick = (bobId: string, titleLink: string) => {
    router.push(`/@${bobId}/${titleLink}`);
  };

  useEffect(() => {
    queryClient.invalidateQueries(["top-reviews-of-restaurant", restaurantId, reviewId]);
  }, [queryClient, restaurantId, reviewId]);

  if (!data || !data.result || isLoading || isError)
    return (
      <>
        <Skeleton height={15} style={{ marginBottom: 20 }} />
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <Skeleton height={80} width={80} style={{ marginRight: 10 }} />
          <div style={{ width: "100%" }}>
            <Skeleton height={20} width="100%" style={{ marginBottom: 10 }} />
            <Skeleton height={50} width="100%" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <Skeleton height={80} width={80} style={{ marginRight: 10 }} />
          <div style={{ width: "100%" }}>
            <Skeleton height={20} width="100%" style={{ marginBottom: 10 }} />
            <Skeleton height={50} width="100%" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
          <Skeleton height={80} width={80} style={{ marginRight: 10 }} />
          <div style={{ width: "100%" }}>
            <Skeleton height={20} width="100%" style={{ marginBottom: 10 }} />
            <Skeleton height={50} width="100%" />
          </div>
        </div>
      </>
    );

  return (
    <Container>
      <Header>
        <span>{restaurantName}</span> 식당의 리뷰들
      </Header>
      {data.result.length ? (
        data.result.map((review) => (
          <ReviewContainer
            key={review.titleLink}
            onClick={() => handleLinkClick(review.bobId!, review.titleLink)}
          >
            <TextContainer>
              <Nickname>
                <span>{restaurantName}</span>
              </Nickname>
              <Title>{review.title}</Title>
              <Preview>{review.preview}</Preview>
              <CreatedAt>{formatDate(review.createdAt)}</CreatedAt>
            </TextContainer>
            {review.imageUrl !== "" ? (
              <ThumbnailContainer>
                <Thumbnail
                  src={generateResizedUrl(review.imageUrl, "medium")}
                  alt="preview-image"
                  width={80}
                  height={80}
                  objectFit="cover"
                />
              </ThumbnailContainer>
            ) : null}
          </ReviewContainer>
        ))
      ) : (
        <>
          <Message>다른 리뷰를 찾지 못했어요.. ( ˘︹˘ )</Message>
          <Line marginTop={30} marginBot={40} />
        </>
      )}
    </Container>
  );
};

const Container = styled.section`
  margin-bottom: 40px;
`;

const Header = styled.span`
  display: block;
  margin-bottom: 20px;
  font-size: 0.9rem;

  span {
    font-weight: 600;
  }
`;

const ReviewContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 5px;
  border-bottom: 1px solid ${({ theme }) => theme.element.placeholder};
  margin: 10px 0;
  cursor: pointer;
`;

const TextContainer = styled.div`
  width: calc(100% - 110px);
`;

const Nickname = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.monochrome_4};
  margin-bottom: 4px;

  span {
    font-weight: 500;
  }
`;

const Title = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Preview = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: ${({ theme }) => theme.text.monochrome_4};
  margin-bottom: 3px;
  font-size: 0.8rem;
  line-height: 1.7;
`;

const CreatedAt = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.monochrome_4};
  margin-bottom: 5px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-right: 10px;
`;

const Thumbnail = styled(Image)`
  border-radius: 3px;
`;

const Message = styled.span`
  color: ${({ theme }) => theme.text.monochrome_3};
`;

export default RelatedArticles;
