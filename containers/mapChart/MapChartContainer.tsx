import styled from "styled-components";
import dynamic from "next/dynamic";
import { ProfilePageProps } from "../../pages/[bobId]";

interface Props {
  userId: ProfilePageProps["profile"]["userId"];
  regions: ProfilePageProps["profile"]["regions"];
}

const KoreaMap = dynamic(() => import("../../components/koreaMap"), { ssr: false });

const MapChartContainer = ({ userId, regions }: Props) => {
  return (
    <Container>
      <KoreaMap userId={userId} regions={regions} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 650px;
`;

export default MapChartContainer;
