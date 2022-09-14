import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import SimplePagination from "../../components/pagination/simple";
import useDeleteFavoriteRestaurant from "../../hooks/queryHooks/useDeleteFavoriteRestaurant";
import { useVisitedRestaurants } from "../../hooks/queryHooks/useVisitedRestaurants";
import { Restaurant } from "../../pages/api/users/[id]/visits";
import { ServerSideProps, WrittenReviews } from "../../pages/[bobId]";
import empty_heart from "../../public/images/icons/empty-heart.svg";
import full_heart from "../../public/images/icons/full-heart.svg";

interface Props {
  writtenReviews: WrittenReviews;
  userName: ServerSideProps["profile"]["name"];
  bobId: ServerSideProps["profile"]["bobId"];
  userId: ServerSideProps["profile"]["userId"];
  isOwner: ServerSideProps["profile"]["isOwner"];
}

const RESTAURANT_LIMIT = 6;

const FavoriteRestaurantContainer = ({
  writtenReviews,
  userName,
  bobId,
  userId,
  isOwner,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [startIdx, setStartIdx] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>();
  const [message, setMessage] = useState("");

  useVisitedRestaurants(userId, {
    onSuccess: (res) => {
      if (res.result) {
        const favoriteRestaurants = res.result.filter((restaurant) => restaurant.isFavorite);

        if (favoriteRestaurants.length) {
          return setRestaurants(favoriteRestaurants);
        }

        setMessage(`${userName} 님은 아직 맛집을 찾지 못했어요.. ( ˘︹˘ )`);
      }
    },
  });

  const deleteFavoriteRestaurant = useDeleteFavoriteRestaurant({
    onSuccess: (res) => {
      if (res.success) alertDeleteSuccess();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["visited-restaurants", userId]);
    },
  });

  restaurants?.sort((a, b) => b.addedDate - a.addedDate);

  const alertDeleteSuccess = () =>
    toast("맛집 리스트에서 삭제했어요", {
      toastId: "delete-favorite-restaurant",
      type: "success",
    });

  const handleNextClick = () => {
    if (restaurants && startIdx + RESTAURANT_LIMIT >= restaurants.length) return;

    setStartIdx((prev) => prev + RESTAURANT_LIMIT);
  };

  const handlePrevClick = () => {
    if (restaurants && startIdx - RESTAURANT_LIMIT < 0) return;

    setStartIdx((prev) => prev - RESTAURANT_LIMIT);
  };

  const handleWriteButtonClick = (name: string, id: string) => () => {
    const encodedName = encodeURIComponent(name.trim());
    const encodedId = encodeURIComponent(id);
    const queries = `restaurant=${encodedName}&id=${encodedId}`;

    router.push(`/posts/review?${queries}`);
  };

  const handleReadReviewClick = (link: string) => () => {
    router.push(link);
  };

  const handleHeartClick = (restaurantId: string, userId: string) => async () => {
    deleteFavoriteRestaurant.mutate({ restaurantId, userId });
  };

  return (
    <Container>
      <Header>
        <div>
          <strong>{userName}</strong> 님의 맛집 · {restaurants?.length} 곳 ·<Order> 등록순</Order>
        </div>
        <SimplePagination
          currentIndex={startIdx}
          itemsPerPage={RESTAURANT_LIMIT}
          totalItems={restaurants?.length}
          toPrevPage={handlePrevClick}
          toNextPage={handleNextClick}
        />
      </Header>
      <div>
        {!restaurants || !restaurants.length ? (
          <Message>{message}</Message>
        ) : (
          restaurants.slice(startIdx, startIdx + RESTAURANT_LIMIT).map((restaurant, i) => {
            const writtenReview = writtenReviews.find(
              ({ restaurantId }) => restaurantId === restaurant.id
            );

            return (
              <RestaurantContainer key={i}>
                <Title>
                  <div>
                    <Name>{restaurant.name.trim()}</Name>
                    <PostCount>{restaurant.posts} 개의 후기</PostCount>
                  </div>
                  <div>
                    {writtenReview && (
                      <ReadReviewButton
                        onClick={handleReadReviewClick(`/@${bobId}/${writtenReview.titleLink}`)}
                      >
                        리뷰 보기
                      </ReadReviewButton>
                    )}
                    {isOwner && !writtenReview && (
                      <WriteButton onClick={handleWriteButtonClick(restaurant.name, restaurant.id)}>
                        글 쓰기
                      </WriteButton>
                    )}
                  </div>
                </Title>
                <Details>
                  <div>
                    <City>{restaurant.city}</City>
                    <Road>{restaurant.roadAddress}</Road>
                  </div>
                  <HeartContainer
                    isOwner={isOwner}
                    onClick={handleHeartClick(restaurant.id, userId)}
                  >
                    {isOwner && restaurant.isFavorite && (
                      <Image src={full_heart} width={25} height={25} alt="heart-icon" />
                    )}
                  </HeartContainer>
                </Details>
              </RestaurantContainer>
            );
          })
        )}
      </div>
    </Container>
  );
};

interface HeartContainerProps {
  isOwner: boolean;
}

const Container = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin-bottom: 15px;
`;

const Message = styled.span`
  color: ${({ theme }) => theme.text.monochrome_3};
`;

const RestaurantContainer = styled.div`
  padding-left: 12px;
  border-left: 5px solid ${({ theme }) => theme.element.green_prism_3};
  margin-bottom: 30px;
`;

const Order = styled.span`
  color: ${({ theme }) => theme.text.monochrome_4};
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Name = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  margin-right: 8px;
`;

const PostCount = styled.span`
  color: ${({ theme }) => theme.text.monochrome_4};
`;

const WriteButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  text-decoration: underline;
  color: ${({ theme }) => theme.text.monochrome_4};
  cursor: pointer;
`;

const ReadReviewButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  padding: 0;
  margin: 0 5px;
  text-decoration: underline;
  color: ${({ theme }) => theme.text.monochrome_4};
  cursor: pointer;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const City = styled.span`
  color: ${({ theme }) => theme.text.highlight_green};
  margin-right: 6px;
`;

const Road = styled.span`
  color: ${({ theme }) => theme.text.monochrome_4};
`;

const HeartContainer = styled.div<HeartContainerProps>`
  width: 25px;
  height: 25px;
  border-radius: 25px;
  cursor: ${({ isOwner }) => isOwner && "pointer"};

  :hover {
    background-color: ${({ theme, isOwner }) => isOwner && theme.element.placeholder};
  }
`;

export default FavoriteRestaurantContainer;
