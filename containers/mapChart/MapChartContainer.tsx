import styled from "styled-components";
import dynamic from "next/dynamic";
import { ServerSideProps } from "../../pages/[bobId]";

interface Props {
  userId: ServerSideProps["profile"]["userId"];
}

const KoreaMap = dynamic(() => import("../../components/koreaMap"), { ssr: false });

const MapChartContainer = ({ userId }: Props) => {
  return (
    <Container>
      <KoreaMap userId={userId} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 650px;
`;

export default MapChartContainer;
