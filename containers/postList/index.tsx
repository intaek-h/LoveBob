import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import GeneralReviewContainer from "../../components/feeds/generalReviewContainer";
import useInfiniteReviews from "../../hooks/queryHooks/useInfiniteReviews";
import { ProfilePageProps } from "../../pages/[bobId]";
import { Line } from "../../styled-components/etc";

interface Props {
  reviews: ProfilePageProps["reviews"];
  totalReviews: number;
  username: ProfilePageProps["profile"]["name"];
  bobId: ProfilePageProps["profile"]["bobId"];
  userId: ProfilePageProps["profile"]["userId"];
  isLastPage: ProfilePageProps["pagination"]["isLastPage"];
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
          <GeneralReviewContainer
            review={review}
            handleClick={() => handleClick(bobId!, review.titleLink)}
            ref={i === posts.length - 1 ? fetchTriggerRef : null}
          />
          <Line marginBot={10} marginTop={10} />
        </Fragment>
      ))}
    </section>
  );
};

const Header = styled.header`
  padding: 10px 0 0px 10px;
  margin-bottom: 20px;

  & :nth-child(5) {
    color: ${({ theme }) => theme.text.monochrome_4};
  }
`;

export default PostListContainer;
