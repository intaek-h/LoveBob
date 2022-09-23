import Image from "next/image";
import styled from "styled-components";
import arrow_forward from "../../public/images/icons/arrow-forward.svg";
import arrow_back from "../../public/images/icons/arrow-back.svg";

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
        <Image src={arrow_back} width={30} height={30} alt="next-page" />
      </PaginateButton>
      <PaginateButton onClick={toNextPage}>
        <Image src={arrow_forward} width={30} height={30} alt="previous-page" />
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

const PaginateButton = styled.div`
  width: 35px;
  height: 30px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.element.hover_light};
  }
`;

export default SimplePagination;
