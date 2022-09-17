import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import styled from "styled-components";
import { Coords } from "../../containers/nearbySearch/NearbySearchContainer";
import KakaoMapService from "../../services/KakaoMapService";
import { TitleInput } from "../../styled-components/inputs";
import RestaurantService, { NearbyRestaurant } from "../../services/RestaurantService";
import { PaddedButton } from "../../styled-components/buttons";
import { darken } from "polished";

interface Props {
  coords: Coords | undefined;
  setRestaurants: Dispatch<SetStateAction<NearbyRestaurant[] | undefined>>;
  setCoords: Dispatch<SetStateAction<Coords | undefined>>;
}

const NearbySearch = ({ coords, setCoords, setRestaurants }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Coords[]>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query) return;

    const { data } = await KakaoMapService.kakaoApiAddressToCoords(query);

    if (data.meta.total_count === 0) {
      setResults(undefined);
      setQuery("");
      return;
    }

    const filteredData = data.documents.map((location) => ({
      address: location.address_name,
      x: location.x,
      y: location.y,
    }));

    setResults(filteredData);
    setQuery("");
  };

  const handleNextButtonClick = async () => {
    if (!coords) return;

    try {
      const response = await RestaurantService.getNearbyRestaurants({ x: coords.x, y: coords.y });

      setRestaurants(response.result);
    } catch (error) {
      setResults(undefined);
      setCoords(undefined);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="address"
          value={query}
          onChange={handleInputChange}
          placeholder="도로명 주소를 입력하세요"
        />
        <SearchButton>검색</SearchButton>
      </Form>
      <ResultContainer>
        {results?.map((result, i) => (
          <AddressContainer key={i} onClick={() => setCoords(result)}>
            <Address selected={coords?.address === result.address}>{result.address}</Address>
          </AddressContainer>
        ))}
      </ResultContainer>
      <Button onClick={handleNextButtonClick} disabled={!!!coords}>
        다음
      </Button>
    </div>
  );
};

interface AddressProp {
  selected?: boolean;
}

const Form = styled.form`
  display: flex;
  justify-content: space-between;
`;

const Input = styled(TitleInput)`
  width: 90%;
`;

const SearchButton = styled.button`
  width: 50px;
`;

const ResultContainer = styled.div`
  margin: 15px 0;
  padding: 0 10px;
`;

const AddressContainer = styled.div`
  padding: 10px 5px;
  margin-bottom: 5px;
  border-radius: 2px;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.element.placeholder};
  }
`;

const Address = styled.span<AddressProp>`
  font-weight: ${({ selected }) => selected && "bold"};
  border-left: 2px solid
    ${({ theme, selected }) =>
      selected ? theme.element.green_prism_3 : theme.element.monochrome_3};
  padding-left: 8px;

  :hover {
    border-left: 2px solid ${({ theme }) => theme.element.green_prism_3};
  }
`;

const Button = styled(PaddedButton)`
  width: 200px;
  height: 35px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${({ theme }) => theme.element.green_prism_3};
  color: ${({ theme }) => theme.text.monochrome_1};

  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.element.green_prism_3)};
  }

  :disabled {
    background-color: ${({ theme }) => theme.element.monochrome_2};
  }
`;

export default NearbySearch;
