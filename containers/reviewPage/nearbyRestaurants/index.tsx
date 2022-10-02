import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import useNearbyRestaurantsOfRestaurant from "../../../hooks/queryHooks/useNearbyRestaurantsOfRestaurant";
import { PostPageStaticProps } from "../../../pages/[bobId]/[titleLink]";
import formatBusinessCategory from "../../../utils/formatBusinessCategory";

interface Props {
  restaurantId: PostPageStaticProps["restaurant"]["id"];
  restaurantName: PostPageStaticProps["restaurant"]["name"];
}

const NearbyRestaurants = ({ restaurantId, restaurantName }: Props) => {
  const { data, isLoading, isError } = useNearbyRestaurantsOfRestaurant(restaurantId);

  if (!data || !data.result || isLoading || isError)
    return (
      <>
        <Skeleton height={20} style={{ marginBottom: 20 }} />

        <Skeleton height={20} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 30 }} />

        <Skeleton height={20} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 30 }} />

        <Skeleton height={20} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 30 }} />

        <Skeleton height={20} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 30 }} />

        <Skeleton height={20} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 10 }} />
        <Skeleton height={15} style={{ marginBottom: 30 }} />
      </>
    );

  return (
    <div>
      <Header>
        <span>{restaurantName}</span> 주변의 인기있는 식당들
      </Header>
      {data.result.length ? (
        data.result.map((restaurant) => (
          <RestaurantContainer key={restaurant.id}>
            <Name>
              {restaurant.name} <span>{`(${formatBusinessCategory(restaurant.category)})`}</span>
            </Name>
            <Address>
              {restaurant.sido_nm} {restaurant.sgg_nm} {restaurant.road}{" "}
              {restaurant.building_number}
            </Address>
            <ReviewCount>{restaurant.reviewCount} 개의 후기</ReviewCount>
          </RestaurantContainer>
        ))
      ) : (
        <Message>다른 리뷰를 찾지 못했어요.. ( ˘︹˘ )</Message>
      )}
    </div>
  );
};

const Header = styled.span`
  display: block;
  margin-bottom: 20px;
  font-size: 0.9rem;

  span {
    font-weight: 600;
  }
`;

const RestaurantContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
`;

const Name = styled.span`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;

  span {
    font-size: 0.8rem;
    font-weight: 400;
    color: ${({ theme }) => theme.text.monochrome_4};
  }
`;

const Address = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.monochrome_4};
  margin-bottom: 10px;
`;

const ReviewCount = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.monochrome_4};
`;

const Message = styled.span`
  color: ${({ theme }) => theme.text.monochrome_3};
`;

export default NearbyRestaurants;
