import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import useRestaurantReviewCount from "../../../hooks/queryHooks/useRestaurantReviewCount";
import useRestaurantVisitStats from "../../../hooks/queryHooks/useRestaurantVisitStats";
import useToolTip from "../../../hooks/viewHooks/useTooltip";
import { PostPageStaticProps } from "../../../pages/[bobId]/[titleLink]";

interface Props {
  bobId: PostPageStaticProps["user"]["bobId"];
  restaurantId: PostPageStaticProps["restaurant"]["id"];
  restaurantName: PostPageStaticProps["restaurant"]["name"];
  city: PostPageStaticProps["restaurant"]["city"];
  roadAddress: PostPageStaticProps["restaurant"]["roadAddress"];
}

interface VisitStats {
  visitCount: number;
  favCount: number;
}

const RestaurantContainer = ({ bobId, restaurantId, restaurantName, city, roadAddress }: Props) => {
  const percentRef = useRef<HTMLDivElement>(null);
  const [visitStats, setVisitStats] = useState<VisitStats>();
  const [reviewCount, setReviewCount] = useState<number>();
  const [isBlurred, setIsBlurred] = useState(true);

  useToolTip(
    percentRef,
    {
      placement: "top",
      text: "이 곳을 방문한 회원 중, 지인에게 강력히 추천할 의향이 있는 회원의 비율 입니다",
      width: 250,
      deltaY: 0,
    },
    isBlurred
  );

  useRestaurantVisitStats(restaurantId, bobId!, {
    enabled: !isBlurred,
    onSettled: (data) => {
      if (!data?.success || !data.result) return;

      setVisitStats({
        visitCount: data.result.visitCount ?? 0,
        favCount: data.result.favCount ?? 0,
      });
    },
  });

  useRestaurantReviewCount(restaurantId, {
    enabled: !isBlurred,
    onSettled: (data) => {
      if (!data?.success || !data.result) return;

      setReviewCount(data.result);
    },
  });

  useEffect(() => {
    setIsBlurred(true);
  }, [restaurantId]);

  if (isBlurred)
    return (
      <CoverContainer>
        <BlurCover onClick={() => setIsBlurred(false)}>
          <strong>{restaurantName}</strong>정보 더보기
          <span className="material-symbols-outlined">unfold_more</span>
        </BlurCover>
      </CoverContainer>
    );

  return (
    <Container>
      <div>
        <Type>식당</Type>
        <Restaurant>{restaurantName}</Restaurant>
        <AddressContainer>
          <span>
            {city} {roadAddress}
          </span>
          <span> · </span>
          {reviewCount ? <span>{reviewCount} 개의 리뷰</span> : <Skeleton width={80} inline />}
        </AddressContainer>
      </div>
      <CountContainer>
        <PercentContainer ref={percentRef}>
          <PercentNum>
            {visitStats ? (
              Math.round((visitStats.favCount / visitStats.visitCount) * 100)
            ) : (
              <Skeleton width={50} inline />
            )}
          </PercentNum>
          <PercentSign>%</PercentSign>
        </PercentContainer>
        {visitStats && visitStats.visitCount < 30 && (
          <span>모수가 적습니다. 값이 편향될 수 있습니다</span>
        )}
      </CountContainer>
    </Container>
  );
};

const Container = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 100px;
  background-color: #fbfbfb;
  margin-bottom: 40px;
  border-radius: 4px;
`;

const Type = styled.span`
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.monochrome_3};
`;

const Restaurant = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  padding-left: 8px;
  border-left: 5px solid ${({ theme }) => theme.text.highlight_blue};
  margin-bottom: 5px;
  color: ${({ theme }) => theme.text.monochrome_4};
`;

const AddressContainer = styled.div`
  margin-top: 5px;

  & > span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text.monochrome_3};
  }
`;

const CountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  & > span {
    display: inline-block;
    margin-bottom: 5px;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.text.error_red};
  }
`;

const PercentContainer = styled.div`
  padding: 5px;
  position: relative;
`;

const PercentNum = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text.monochrome_4};
`;

const PercentSign = styled.span`
  font-weight: bold;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.monochrome_3};
`;

const CoverContainer = styled.div`
  height: 50px;
  margin-bottom: 90px;
`;

const BlurCover = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.monochrome_4};
  z-index: 10;
  cursor: pointer;
  background-color: #fbfbfb;

  &:hover {
    backdrop-filter: blur(20px);
    transition-duration: 0.3s;
    background-color: #00000009;
  }

  strong {
    margin-right: 5px;
  }

  span.material-symbols-outlined {
    font-size: 1rem;
    margin-left: 3px;
  }
`;

export default RestaurantContainer;
