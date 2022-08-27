import axios from "axios";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import styled from "styled-components";
import ApiService from "../../services/Api";
import { Restaurant } from "./NearbyRestaurants";
import { Coords } from "../../containers/nearbySearch/NearbySearchContainer";

interface Props {
  coords: Coords | undefined;
  setRestaurants: Dispatch<SetStateAction<Restaurant[] | undefined>>;
  setCoords: Dispatch<SetStateAction<Coords | undefined>>;
}

interface RestaurantsResponse {
  success: boolean;
  result: Restaurant[];
}

const ApiInstance = new ApiService(axios);

const NearbySearch = ({ coords, setCoords, setRestaurants }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Coords[]>();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query) return;

    const { data } = await ApiInstance.kakaoApiAddressToCoords(query);

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
      const { data } = await axios.get<RestaurantsResponse>(
        `/api/restaurants?x=${coords.x}&y=${coords.y}`
      );

      setRestaurants(data.result);
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
        {results &&
          results.map((result, i) => (
            <AddressContainer key={i} onClick={() => setCoords(result)}>
              <Address selected={coords?.address === result.address}>{result.address}</Address>
            </AddressContainer>
          ))}
      </ResultContainer>
      <NextButton onClick={handleNextButtonClick} disabled={!!!coords}>
        다음
      </NextButton>
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

const Input = styled.input`
  font-size: 0.95rem;
  width: 90%;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.element.monochrome_2};
  border-radius: 4px;
`;

const SearchButton = styled.button`
  width: 50px;
`;

const ResultContainer = styled.div`
  margin: 15px 0;
  padding: 0 10px;
`;

const AddressContainer = styled.div`
  padding: 10px 0;
`;

const Address = styled.span<AddressProp>`
  font-weight: ${(prop) => prop.selected && "bold"};
  border-left: 2px solid ${(prop) => (prop.selected ? "#0fae00" : "#bcbcbc")};
  padding-left: 8px;
  cursor: pointer;

  :hover {
    border-left: 2px solid #0fae00;
  }
`;

const NextButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 4px;
  background-color: #2da44e;
  width: 200px;
  padding: 10px;
  margin-left: 5px;
  color: #ffffff;
  cursor: pointer;

  :disabled {
    background-color: ${({ theme }) => theme.element.placeholder};
  }
`;

export default NearbySearch;
