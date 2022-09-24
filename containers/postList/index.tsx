import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useInfiniteReviews from "../../hooks/queryHooks/useInfiniteReviews";
import { ServerSideProps } from "../../pages/[bobId]";
import ReviewService from "../../services/ReviewService";
import { Line } from "../../styled-components/etc";
import { formatDate } from "../../utils/formatDate";
import { generateResizedUrl } from "../../utils/generateResizedUrl";

interface Props {
  reviews: ServerSideProps["reviews"];
  totalReviews: number;
  username: ServerSideProps["profile"]["name"];
  bobId: ServerSideProps["profile"]["bobId"];
  userId: ServerSideProps["profile"]["userId"];
  isLastPage: ServerSideProps["pagination"]["isLastPage"];
}

const PostListContainer = ({
  reviews,
  totalReviews,
  username,
  bobId,
  userId,
  isLastPage,
}: Props) => {
  const router = useRouter();

  const [posts, setPosts] = useState(reviews);

  const { data, hasNextPage, fetchNextPage } = useInfiniteReviews(bobId!, userId, {
    enabled: !isLastPage,
    getNextPageParam: (lastPage) => {
      if (!lastPage.result || lastPage.result.isLastPage) return;
      return lastPage.result.page;
    },
  });

  const handleClick = (bobId: string, titleLink: string) => {
    router.push(`/@${bobId}/${titleLink}`);
  };

  const observer = useRef<IntersectionObserver>();

  const fetchTriggerRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    if (!data) return;
    const moreReviews = data.pages.map((res) => res.result!.reviews).flat();

    setPosts(reviews.concat(moreReviews));
  }, [data, reviews]);

  return (
    <section>
      <Header>
        <span>
          <strong>{username}</strong> 님이 작성한 글
        </span>
        <span> · </span>
        <span>{totalReviews} 개</span>
        <span> · </span>
        <span>최신순</span>
      </Header>

      {posts.map((review, i) => (
        <Fragment key={review.id}>
          <Container ref={i === posts.length - 1 ? fetchTriggerRef : null}>
            <TextContainer onClick={() => handleClick(bobId!, review.titleLink)}>
              <TitleContainer>
                {review.type === "식당 리뷰" && (
                  <RestaurantAddress>
                    {review.restaurant}
                    {review.isFavorite && (
                      <FavoriteTag title={`${username} 님이 선택한 맛집입니다`}>
                        {" "}
                        · 맛집 <Check className="material-symbols-outlined">check</Check>
                      </FavoriteTag>
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
          <Line marginBot={10} marginTop={10} />
        </Fragment>
      ))}
    </section>
  );
};

const Header = styled.header`
  padding: 10px 0 20px 10px;
  margin-bottom: 10px;

  & :nth-child(5) {
    color: ${({ theme }) => theme.text.monochrome_4};
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(100% - 120px);
  cursor: pointer;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RestaurantAddress = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.highlight_green};
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
  margin-bottom: 6px;
`;

const Preview = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: ${({ theme }) => theme.text.monochrome_5};
  margin-bottom: 10px;
  font-size: 0.9rem;
`;

const PostInfoContainer = styled.div`
  & > span {
    color: ${({ theme }) => theme.text.monochrome_5};
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

export default PostListContainer;
