import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSession } from "../../hooks/queryHooks/useSession";
import { useVisitedRestaurants } from "../../hooks/queryHooks/useVisitedRestaurants";
import { ErrorMsg, SuccessMsg } from "../../styled-components/texts";
import { useQueryClient } from "@tanstack/react-query";
import { Restaurant } from "../../services/RestaurantService";
import useAddVisitedRestaurant from "../../hooks/queryHooks/useAddVisitedRestaurant";
import useDeleteVisitedRestaurant from "../../hooks/queryHooks/useDeleteVisitedRestaurant";

interface Props {
  restaurants?: Restaurant[];
}

export interface Visited {
  [restaurantId: string]: boolean;
}

const NearbyRestaurants = ({ restaurants }: Props) => {
  const queryClient = useQueryClient();

  const [session] = useSession();
  const { data } = useVisitedRestaurants(session.userId, {
    onError: () => {
      setError("방문한 음식점 목록을 불러오지 못했습니다");
    },
  });

  const [visitedList, setVisitedList] = useState<Visited>();
  const [error, setError] = useState("");

  const addVisit = useAddVisitedRestaurant({
    onSuccess: () => {
      queryClient.invalidateQueries(["visited-restaurants"]);
    },
    onError: () => {
      setError("요청을 수행하지 못했습니다");
    },
  });

  const deleteVisit = useDeleteVisitedRestaurant({
    onSuccess: () => {
      queryClient.invalidateQueries(["visited-restaurants"]);
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
      // deleteVisit.mutate({ restaurantId, userId: session.userId });
      return;
    }

    addVisit.mutate({ restaurantId, userId: session.userId });
  };

  useEffect(() => {
    if (!data || !data.success) return;

    const result: Visited = {};

    data.result?.forEach((visit) => {
      result[visit.restaurantId] = true;
    });

    setVisitedList(result);
  }, [data]);

  if (!restaurants) return <span>검색 결과가 없습니다</span>;

  return (
    <Container>
      <Guide>방문했던 음식점을 모두 클릭해주세요</Guide>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {restaurants.map((restaurant, i) => (
        <RestaurantContainer
          key={i}
          onClick={handleClick(restaurant.id)}
          visited={visitedList ? !!visitedList[restaurant.id] : false}
        >
          <div>
            <Name>
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

const Container = styled.div`
  margin: 15px 0;
`;

const Guide = styled(SuccessMsg)`
  display: block;
  margin: 0 0 5px 5px;
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

const Name = styled.span`
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
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

export default NearbyRestaurants;
