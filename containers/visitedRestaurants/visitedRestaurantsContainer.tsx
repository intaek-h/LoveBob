import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import SimplePagination from "../../components/pagination/simple";
import useAddFavoriteRestaurant from "../../hooks/queryHooks/useAddFavoriteRestaurant";
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
const noop = () => {};

const VisitedRestaurantsContainer = ({
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

  restaurants?.sort((a, b) => b.addedDate - a.addedDate);

  const addFavoriteRestaurant = useAddFavoriteRestaurant({
    onSuccess: (res) => {
      if (res.success) alertAddSuccess();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["visited-restaurants", userId]);
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

  useVisitedRestaurants(userId, {
    onSuccess: (res) => {
      if (res.result) {
        setRestaurants(res.result);
      }
    },
  });

  const alertDeleteSuccess = () =>
    toast("?????? ??????????????? ???????????????", {
      toastId: "delete-favorite-restaurant",
      type: "success",
    });

  const alertAddSuccess = () =>
    toast("?????? ???????????? ???????????????", {
      toastId: "add-favorite-restaurant",
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

  const handleHeartClick = (status: boolean, restaurantId: string, userId: string) => async () => {
    if (status === false) {
      return addFavoriteRestaurant.mutate({ restaurantId, userId });
    }

    if (status === true) {
      return deleteFavoriteRestaurant.mutate({ restaurantId, userId });
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <strong>{userName}</strong> ?????? ????????? ????????? ?? {restaurants?.length} ??? ??
          <Order> ?????????</Order>
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
        {restaurants?.slice(startIdx, startIdx + RESTAURANT_LIMIT).map((restaurant, i) => {
          const writtenReview = writtenReviews.find(
            ({ restaurantId }) => restaurantId === restaurant.id
          );

          return (
            <RestaurantContainer key={i}>
              <Title>
                <div>
                  <Name>{restaurant.name.trim()}</Name>
                  <PostCount>{restaurant.posts} ?????? ??????</PostCount>
                </div>
                <div>
                  {isOwner && !writtenReview && (
                    <WriteButton onClick={handleWriteButtonClick(restaurant.name, restaurant.id)}>
                      ??? ??????
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
                  onClick={
                    isOwner ? handleHeartClick(restaurant.isFavorite, restaurant.id, userId) : noop
                  }
                >
                  {isOwner && restaurant.isFavorite && (
                    <Image src={full_heart} width={25} height={25} alt="star" />
                  )}
                  {isOwner && !restaurant.isFavorite && (
                    <Image src={empty_heart} width={25} height={25} alt="star" />
                  )}
                  {!isOwner && restaurant.isFavorite && (
                    <Image src={full_heart} width={25} height={25} alt="star" />
                  )}
                </HeartContainer>
              </Details>
              {writtenReview && (
                <ReadReviewButton
                  onClick={handleReadReviewClick(`/@${bobId}/${writtenReview.titleLink}`)}
                >
                  <span>??????: </span>
                  {writtenReview.title}
                </ReadReviewButton>
              )}
            </RestaurantContainer>
          );
        })}
      </div>
    </Container>
  );
};

interface HeartContainerProps {
  isOwner: boolean;
}

const Container = styled.div`
  width: 100%;
  height: 620px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin-bottom: 15px;
`;

const RestaurantContainer = styled.div`
  padding-left: 12px;
  border-left: 5px solid ${({ theme }) => theme.element.monochrome_2};
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

const ReadReviewButton = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 10px;
  font-style: italic;
  color: ${({ theme }) => theme.text.monochrome_5};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }

  & > span {
    font-style: normal;
  }
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

export default VisitedRestaurantsContainer;
