import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSession } from "../../hooks/queryHooks/useSession";
import { useVisitedRestaurants } from "../../hooks/queryHooks/useVisitedRestaurants";
import { ErrorMsg, SuccessMsg } from "../../styled-components/texts";
import { useQueryClient } from "@tanstack/react-query";
import { Restaurant } from "../../services/RestaurantService";
import useAddVisitedRestaurant from "../../hooks/queryHooks/useAddVisitedRestaurant";
import useDeleteVisitedRestaurant from "../../hooks/queryHooks/useDeleteVisitedRestaurant";
import { Coords } from "../../containers/nearbySearch/NearbySearchContainer";
import { Line } from "../../styled-components/etc";
import SimplePagination from "../pagination/simple";

interface Props {
  restaurants?: Restaurant[];
  address: Coords["address"] | undefined;
  reset: () => void;
}

export interface Visited {
  [restaurantId: string]: boolean;
}

const RESTAURANT_LIMIT = 10;

const NearbyRestaurants = ({ restaurants, address, reset }: Props) => {
  const queryClient = useQueryClient();

  const [session] = useSession();

  const [startIdx, setStartIdx] = useState(0);
  const [visitedList, setVisitedList] = useState<Visited>();
  const [error, setError] = useState("");

  const { data: visits } = useVisitedRestaurants(session.user.id, {
    enabled: !!session,
    onError: () => {
      setError("방문한 음식점 목록을 불러오지 못했습니다");
    },
  });

  const addVisit = useAddVisitedRestaurant({
    onSettled: () => {
      queryClient.invalidateQueries(["visited-restaurants", session.user.id]);
    },
    onError: () => {
      setError("요청을 수행하지 못했습니다");
    },
  });

  const deleteVisit = useDeleteVisitedRestaurant({
    onSettled: () => {
      queryClient.invalidateQueries(["visited-restaurants", session.user.id]);
    },
    onError: () => {
      setError("요청을 수행하지 못했습니다");
    },
  });

  const handleClick = (restaurantId: string) => async () => {
    setError("");

    if (visitedList && visitedList[restaurantId]) {
      // 리뷰를 작성했다면 "방문함"을 취소할 수 없도록 만들 계획.
      // 그때 까지는 "방문함"을 취소할 수 없게 하기 위해 아래 코드를 주석처리 함.
      // deleteVisit.mutate({ restaurantId, userId: session.user.id });
      return;
    }

    addVisit.mutate({ restaurantId, userId: session.user.id });
  };

  const handleNextClick = () => {
    if (restaurants && startIdx + RESTAURANT_LIMIT >= restaurants.length) return;

    setStartIdx((prev) => prev + RESTAURANT_LIMIT);
  };

  const handlePrevClick = () => {
    if (restaurants && startIdx - RESTAURANT_LIMIT < 0) return;

    setStartIdx((prev) => prev - RESTAURANT_LIMIT);
  };

  useEffect(() => {
    if (!visits || !visits.success) return;

    const result: Visited = {};

    visits.result?.forEach((visit) => {
      result[visit.id] = true;
    });

    setVisitedList(result);
  }, [visits]);

  if (!restaurants) return <span>검색 결과가 없습니다</span>;

  return (
    <Container>
      <Header>
        <GuideContainer>
          <SearchAddress>{address}</SearchAddress>
          <Guide>방문했던 음식점을 모두 클릭해주세요</Guide>
          <Reset onClick={reset}>다시 검색하기</Reset>
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </GuideContainer>
        <SimplePagination
          currentIndex={startIdx}
          itemsPerPage={RESTAURANT_LIMIT}
          totalItems={restaurants.length}
          toPrevPage={handlePrevClick}
          toNextPage={handleNextClick}
        />
      </Header>
      <Line marginBot={20} marginTop={20} />
      {restaurants.slice(startIdx, startIdx + RESTAURANT_LIMIT).map((restaurant, i) => (
        <RestaurantContainer
          key={i}
          onClick={handleClick(restaurant.id)}
          visited={visitedList ? !!visitedList[restaurant.id] : false}
        >
          <div>
            <Name visited={visitedList ? !!visitedList[restaurant.id] : false}>
              {restaurant.name} {restaurant.subName}
            </Name>
            <Address>
              {restaurant.sido_nm} {restaurant.sgg_nm} {restaurant.road}{" "}
              {restaurant.building_number}
            </Address>
          </div>
          <VisitedTag>{visitedList && visitedList[restaurant.id] ? "방문함" : null}</VisitedTag>
        </RestaurantContainer>
      ))}
    </Container>
  );
};

interface RestaurantContainerProps {
  visited: boolean;
}

interface NameProps {
  visited: boolean;
}

const Container = styled.div`
  margin: 15px 0;
`;

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchAddress = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Guide = styled.span`
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const Reset = styled.span`
  color: ${({ theme }) => theme.text.monochrome_4};
  font-size: 0.9rem;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

const RestaurantContainer = styled.div<RestaurantContainerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  margin-bottom: 5px;
  border-radius: 2px;
  background-color: ${({ visited, theme }) => visited && theme.element.green_prism_1};
  cursor: ${({ visited }) => !visited && "pointer"};

  :hover {
    background-color: ${({ theme, visited }) => !visited && theme.element.placeholder};
  }
`;

const Name = styled.span<NameProps>`
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
  color: ${({ visited, theme }) => visited && theme.text.monochrome_3};
`;

const Address = styled.span`
  display: block;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.text.monochrome_3};
`;

const VisitedTag = styled.span`
  appearance: none;
  border: none;
  background: none;
  color: ${({ theme }) => theme.text.highlight_green};
  margin-right: 5px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export default NearbyRestaurants;
