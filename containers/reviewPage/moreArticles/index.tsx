import { useRouter } from "next/router";
import { Fragment } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import GeneralReviewContainer from "../../../components/feeds/generalReviewContainer";
import useAuthorRecentReviews from "../../../hooks/queryHooks/useAuthorRecentReviews";
import { PostPageStaticProps } from "../../../pages/[bobId]/[titleLink]";
import { Line } from "../../../styled-components/etc";

interface Props {
  userId: PostPageStaticProps["user"]["userId"];
  bobId: PostPageStaticProps["user"]["bobId"];
  reviewId: PostPageStaticProps["review"]["id"];
}

const MoreArticles = ({ userId, reviewId, bobId }: Props) => {
  const router = useRouter();

  const { data, isLoading, isError } = useAuthorRecentReviews({ userId, reviewId, take: 2 });

  const handleClick = (bobId: string, titleLink: string) => {
    router.push(`/@${bobId}/${titleLink}`);
  };

  if (isLoading || isError)
    return (
      <Container>
        <Skeleton height={20} style={{ marginBottom: 10 }} />
        <Skeleton height={90} style={{ marginBottom: 20 }} />
        <Skeleton height={1} />
        <Skeleton height={20} style={{ marginBottom: 10 }} />
        <Skeleton height={90} />
      </Container>
    );

  return (
    <Container>
      {data?.result?.map((review) => (
        <Fragment key={review.id}>
          <GeneralReviewContainer
            review={review}
            handleClick={() => handleClick(bobId!, review.titleLink)}
          />
          <Line marginBot={10} marginTop={10} />
        </Fragment>
      ))}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
`;

export default MoreArticles;
