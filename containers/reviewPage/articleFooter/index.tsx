import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useCancelReviewUpvote from "../../../hooks/queryHooks/useCancelReviewUpvote";
import useCheckMyReviewVote from "../../../hooks/queryHooks/useCheckMyReviewVote";
import { useSession } from "../../../hooks/queryHooks/useSession";
import useUpvoteReviews from "../../../hooks/queryHooks/useUpvoteReview";
import { PostPageStaticProps } from "../../../pages/[bobId]/[titleLink]";
import { Line } from "../../../styled-components/etc";

interface Props {
  userId: PostPageStaticProps["user"]["userId"];
  nickname: PostPageStaticProps["user"]["name"];
  reviewId: PostPageStaticProps["review"]["id"];
  regions: string[];
}

const ArticleFooter = ({ nickname, regions, reviewId, userId }: Props) => {
  const queryClient = useQueryClient();

  const [session] = useSession();
  const [isVoted, setIsVoted] = useState(false);

  const { mutate: upvote } = useUpvoteReviews({
    onSuccess: (res) => {
      if (res.success) toastUpvoteSuccess();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["review-vote-count", reviewId]);
      queryClient.invalidateQueries(["my-review-vote", reviewId]);
    },
  });

  const { mutate: cancelVote } = useCancelReviewUpvote({
    onSuccess: (res) => {
      if (res.success) toastUpvoteCancelSuccess();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["review-vote-count", reviewId]);
      queryClient.invalidateQueries(["my-review-vote", reviewId]);
    },
  });

  const toastUpvoteSuccess = () => {
    toast("리뷰를 추천했어요!", {
      toastId: "review-upvote-success",
      type: "success",
    });
  };

  const toastUpvoteCancelSuccess = () => {
    toast("추천을 취소했어요", {
      toastId: "review-upvote-cancel",
      type: "success",
    });
  };

  const toastDisallowSelfUpvote = () => {
    toast("본인 글을 추천할 수 없습니다", {
      toastId: "cannot-upvote-my-review",
      type: "error",
    });
  };

  const handleUpvote = () => {
    if (userId === session.user.id) {
      return toastDisallowSelfUpvote();
    }

    upvote({ userId: session.user.id, reviewId });
  };

  const handleCancelUpvote = () => {
    if (userId === session.user.id) return;

    cancelVote({ userId: session.user.id, reviewId });
  };

  useCheckMyReviewVote(session?.user.id, reviewId, {
    enabled: !!session,
    onSettled: (data) => {
      if (!data?.success) return;
      setIsVoted(data.result!);
    },
  });

  return (
    <Container>
      {session &&
        (isVoted ? (
          <CancelVoteButton onClick={handleCancelUpvote}>
            이 글을 <strong>추천했습니다</strong>
          </CancelVoteButton>
        ) : (
          <UpvoteButton onClick={handleUpvote}>
            이 글을 <strong>추천합니다</strong>
          </UpvoteButton>
        ))}
      <LineWrapper>
        <Line marginTop={50} marginBot={20} />
      </LineWrapper>
      <Suggestion>{nickname} 님의 다른 글도 읽어보세요</Suggestion>
      {regions.length && (
        <Regions>
          <strong>{nickname}</strong> 님은 <strong>{regions.join(" · ")}</strong> 를 거점으로 하는
          작가입니다
        </Regions>
      )}
    </Container>
  );
};

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 130px;
  height: 200px;
`;

const UpvoteButton = styled.button`
  display: block;
  text-align: center;
  appearance: none;
  border: none;
  padding: 0;
  padding: 10px 0;
  width: 100%;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.monochrome_2};
  background-color: transparent;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.monochrome_3};
    transition-duration: 0.1s;
  }
`;

const CancelVoteButton = styled.button`
  display: block;
  text-align: center;
  appearance: none;
  border: none;
  padding: 0;
  padding: 10px 0;
  width: 100%;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.blue_prism_1};
  background-color: transparent;
  cursor: pointer;
`;

const LineWrapper = styled.div`
  width: 50%;
`;

const Suggestion = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Regions = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.monochrome_3};

  strong {
    font-weight: 600;

    &:first-child {
      color: ${({ theme }) => theme.text.monochrome_3};
    }

    &:last-child {
      color: ${({ theme }) => theme.text.monochrome_3};
    }
  }
`;

export default ArticleFooter;
