import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import { ServerSideProps } from "../../pages/users/[id]";

interface Props {
  restaurants: ServerSideProps["visitedRestaurants"];
  userName: string | undefined;
}

const RESTAURANT_LIMIT = 6;

const VisitedRestaurantsContainer = ({ restaurants, userName }: Props) => {
  const [startIdx, setStartIdx] = useState(0);

  const router = useRouter();

  const handleNextClick = () => {
    if (restaurants && startIdx + RESTAURANT_LIMIT > restaurants.length) return;

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

  return (
    <Container>
      <Header>
        <div>
          <strong>{userName}</strong> 님이 다녀온 식당들 · {restaurants?.length} 곳 ·
          <Order> 최신순</Order>
        </div>
        <div>
          <PaginateButton onClick={handlePrevClick}>
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </PaginateButton>
          <PaginateButton onClick={handleNextClick}>
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </PaginateButton>
        </div>
      </Header>
      <div>
        {restaurants?.slice(startIdx, startIdx + RESTAURANT_LIMIT).map((restaurant, i) => (
          <RestaurantContainer key={i}>
            <Title>
              <div>
                <Name>{restaurant.name.trim()}</Name>
                <PostCount>{restaurant.posts} 개의 후기</PostCount>
              </div>
              <WriteButton onClick={handleWriteButtonClick(restaurant.name, restaurant.id)}>
                글 쓰기
              </WriteButton>
            </Title>
            <div>
              <City>{restaurant.city}</City>
              <Road>{restaurant.roadAddress}</Road>
            </div>
          </RestaurantContainer>
        ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 30px;
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

const PaginateButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  padding: 0;

  & > span {
    color: ${({ theme }) => theme.text.monochrome_2};
    font-weight: bold;
    padding: 3px 5px;
    border-radius: 4px;
    cursor: pointer;

    :hover {
      background-color: ${({ theme }) => theme.element.hover_light};
    }
  }
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

const City = styled.span`
  color: ${({ theme }) => theme.text.highlight_green};
  margin-right: 6px;
`;

const Road = styled.span`
  color: ${({ theme }) => theme.text.monochrome_4};
`;

export default VisitedRestaurantsContainer;
