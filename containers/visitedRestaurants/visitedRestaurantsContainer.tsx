import styled from "styled-components";
import { ServerSideProps } from "../../pages/users/[id]";

interface Props {
  restaurants: ServerSideProps["visitedRestaurants"];
  userName: string | undefined;
}

const VisitedRestaurantsContainer = ({ restaurants, userName }: Props) => {
  console.log(restaurants);

  return (
    <Container>
      <span>
        {userName} 님이 다녀온 식당들 · {restaurants?.length} 곳 · 최신순
      </span>
      <div>
        {restaurants?.map((restaurant, i) => (
          <div key={i}>
            <div style={{ display: "flex" }}>
              <div>
                <span>{restaurant.name}</span>
                <span>{restaurant.city}</span>
              </div>
              <span>이 식당에 대한 글 쓰기 · 댓글 쓰기</span>
            </div>
            <div>
              <span>{restaurant.roadAddress}</span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
  width: 100%;
  height: 650px;
  border: 1px solid #d8d8d8;
`;

export default VisitedRestaurantsContainer;
