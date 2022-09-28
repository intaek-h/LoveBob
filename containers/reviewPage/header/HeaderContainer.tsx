import Image from "next/image";
import { useRef, useState } from "react";
import styled from "styled-components";
import useReviewVoteCount from "../../../hooks/queryHooks/useReviewVoteCount";
import useToolTip from "../../../hooks/viewHooks/useTooltip";
import { PostPageStaticProps } from "../../../pages/[bobId]/[titleLink]";
import { generateResizedUrl } from "../../../utils/generateResizedUrl";

interface Props {
  nickname: PostPageStaticProps["user"]["name"];
  restaurantName: PostPageStaticProps["restaurant"]["name"];
  postType: PostPageStaticProps["review"]["type"];
  title: PostPageStaticProps["review"]["title"];
  createdAt: PostPageStaticProps["review"]["createdAt"];
  profileImage: PostPageStaticProps["user"]["image"];
  reviewId: PostPageStaticProps["review"]["id"];
  isFavorite: PostPageStaticProps["restaurant"]["isFavorite"];
  contentLength: number;
}

const HeaderContainer = ({
  nickname,
  createdAt,
  postType,
  title,
  contentLength,
  profileImage,
  isFavorite,
  reviewId,
  restaurantName,
}: Props) => {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const contentDescription = contentLength > 500 ? "자세한 글" : "짧은 글";

  const favoriteTagRef = useRef<HTMLDivElement>(null);

  const [voteCount, setVoteCount] = useState(0);

  useToolTip(favoriteTagRef, {
    placement: "bottom",
    text: `${nickname} 님은 이 곳을 지인에게 강력히 추천할 의향이 있습니다`,
    width: 250,
    deltaY: 0,
  });

  useReviewVoteCount(reviewId, {
    onSettled: (data) => {
      if (data?.result !== undefined) {
        setVoteCount(data.result);
      }
    },
  });

  return (
    <Container>
      <HeadContainer>
        <ProfileContainer>
          <ProfileImage>
            <Image
              src={generateResizedUrl(profileImage!, "small")}
              width={30}
              height={30}
              alt="profile-image"
            />
          </ProfileImage>
          <Description>
            <strong>{nickname}</strong> 님의 <strong>{postType}</strong>
          </Description>
        </ProfileContainer>
        {isFavorite && (
          <FavoriteTag ref={favoriteTagRef}>
            강력 추천
            <Check className="material-symbols-outlined">check</Check>
          </FavoriteTag>
        )}
      </HeadContainer>
      <Title>{title}</Title>
      <Info>
        <span>
          {year} 년 {month} 월의
        </span>
        <span> {contentDescription}</span>
        <span> · </span>
        <span>{restaurantName}</span>
        <span> · </span>
        <span>
          추천 {voteCount} <VoteIcon className="material-symbols-outlined">trending_up</VoteIcon>
        </span>
      </Info>
    </Container>
  );
};

const Container = styled.header`
  margin-bottom: 20px;
  padding-bottom: 20px;
`;

const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
`;

const FavoriteTag = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding: 3px 10px;
  color: ${({ theme }) => theme.text.highlight_blue};
  font-weight: 500;
`;

const Check = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  vertical-align: top;
  margin-left: 5px;
`;

const Description = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.monochrome_4};
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 30px;
  line-height: 1.3;
`;

const Info = styled.div`
  & > span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text.monochrome_4};
  }
`;

const VoteIcon = styled.span`
  vertical-align: text-bottom;
  font-size: 1rem;
`;

export default HeaderContainer;
