import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSession } from "../../hooks/useSession";
import { useVisitedRestaurants, Visited } from "../../hooks/useVisitedRestaurants";
import { useMutation, useQueryClient } from "react-query";

export interface Restaurant {
  id: string;
  building_number: string;
  name: string;
  road: string;
  sgg_nm: string;
  sido_nm: string;
  subName: string;
  x: number;
  y: number;
}

interface Props {
  restaurants?: Restaurant[];
}

const NearbyRestaurants = ({ restaurants }: Props) => {
  const queryClient = useQueryClient();

  const [session] = useSession();
  const { data } = useVisitedRestaurants(session.userId);

  const deleteVisit = useMutation(
    (restaurantId: string) => axios.delete(`/api/users/${session.userId}/visits/${restaurantId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["visited-restaurants"]);
      },
      onError: () => {
        setError("요청을 수행하지 못했습니다");
      },
    }
  );
  const addVisit = useMutation(
    (restaurantId: string) => axios.post(`/api/users/${session.userId}/visits/${restaurantId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["visited-restaurants"]);
      },
      onError: () => {
        setError("요청을 수행하지 못했습니다");
      },
    }
  );

  const [visitedList, setVisitedList] = useState<Visited>();
  const [error, setError] = useState("");

  const handleClick = (restaurantId: string) => async () => {
    setError("");

    if (visitedList && visitedList[restaurantId]) {
      deleteVisit.mutate(restaurantId);
      return;
    }

    addVisit.mutate(restaurantId);
  };

  useEffect(() => {
    setVisitedList(data);
  }, [data]);

  if (!restaurants) return <span>검색 결과가 없습니다</span>;

  return (
    <Container>
      <Guide>방문했던 음식점을 모두 클릭해주세요</Guide>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {restaurants.map((restaurant, i) => (
        <RestaurantContainer key={i} onClick={handleClick(restaurant.id)}>
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

const Container = styled.div`
  margin: 15px 0;
`;

const Guide = styled.span`
  display: block;
  margin: 0 0 5px 5px;
  font-size: 0.8rem;
  color: #7fb4ff;
`;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: #ff6f6f;
`;

const RestaurantContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  margin-bottom: 5px;
  cursor: pointer;

  :hover {
    background-color: #f8f8f8;
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
  color: #a8a8a8;
`;

const VisitedTag = styled.span`
  appearance: none;
  border: none;
  background: none;
  color: #2da44e;
  margin-right: 5px;
`;

export default NearbyRestaurants;
