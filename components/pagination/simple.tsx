import styled from "styled-components";

interface Props {
  currentIndex: number;
  totalItems: number | undefined;
  itemsPerPage: number;
  toNextPage: () => void;
  toPrevPage: () => void;
}

const SimplePagination = ({
  currentIndex,
  totalItems,
  itemsPerPage,
  toNextPage,
  toPrevPage,
}: Props) => {
  return (
    <PaginateContainer>
      {totalItems ? (
        <PageCount>
          ({currentIndex / itemsPerPage + 1} / {Math.ceil(totalItems / itemsPerPage)})
        </PageCount>
      ) : (
        <PageCount>(0 / 0)</PageCount>
      )}
      <PaginateButton onClick={toPrevPage}>
        <span className="material-symbols-outlined">arrow_back_ios_new</span>
      </PaginateButton>
      <PaginateButton onClick={toNextPage}>
        <span className="material-symbols-outlined">arrow_forward_ios</span>
      </PaginateButton>
    </PaginateContainer>
  );
};

const PaginateContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PageCount = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.monochrome_3};
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

export default SimplePagination;
