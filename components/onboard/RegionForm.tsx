import { Chip } from "@mui/material";
import { Regions } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { ValidInputs } from ".";
import ProfileService from "../../services/ProfileService";

interface Props {
  regionIds: number[];
  setValidInputs: Dispatch<SetStateAction<ValidInputs>>;
}

const RegionForm = ({ regionIds, setValidInputs }: Props) => {
  const [regions, setRegions] = useState<Regions[]>([]);

  const handleChipClick = (region: Regions) => () => {
    const index = regionIds.indexOf(region.id);

    if (regionIds.includes(region.id)) {
      return setValidInputs((prev) => {
        const temp = prev.regions.slice();
        temp.splice(index, 1);
        return {
          ...prev,
          regions: [...temp],
        };
      });
    }

    if (!regionIds.includes(region.id) && regionIds.length === 2) return;

    setValidInputs((prev) => ({
      ...prev,
      regions: [...prev.regions, region.id],
    }));
  };

  useEffect(() => {
    async function fetchRegions() {
      try {
        const { result } = await ProfileService.getAllRegions();

        if (!result) return;

        setRegions(result);
      } catch (error) {}
    }

    fetchRegions();
  }, []);

  return (
    <RegionContainer>
      <Header>
        <span>
          <strong>거점</strong>을 선택해주세요 (최대 2 곳)
        </span>
        <RegionGuide>거점은 지역의 맛집을 찾는 독자에게 신뢰감을 제공합니다</RegionGuide>
      </Header>
      {regions.map((region) => (
        <Chip
          key={region.id}
          sx={{ margin: "3px 3px 3px 0" }}
          label={region.region}
          color="success"
          variant={regionIds.includes(region.id) ? "filled" : "outlined"}
          onClick={handleChipClick(region)}
        />
      ))}
    </RegionContainer>
  );
};

const RegionContainer = styled.div`
  padding-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;

  h1 {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  span {
    font-weight: 300;
  }
`;

const RegionGuide = styled.span`
  &&& {
    font-size: 0.8rem;
    font-weight: 400;
    margin-top: 8px;
  }
`;

export default RegionForm;
