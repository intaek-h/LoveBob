import type { ReactImageGalleryItem } from "react-image-gallery";
import styled from "styled-components";
import ImageCarousel from "../../../components/imageCarousel";
import { PostPageStaticProps } from "../../../pages/[bobId]/[titleLink]";

interface Props {
  urls: PostPageStaticProps["review"]["imageUrl"];
}

const IMAGE_HEIGHT = 400;

const GalleryContainer = ({ urls }: Props) => {
  const items: ReactImageGalleryItem[] = urls.map((url) => ({
    original: url,
    originalHeight: IMAGE_HEIGHT,
  }));

  return (
    <Container>
      <ImageCarousel items={items} />
    </Container>
  );
};

const Container = styled.div`
  height: ${IMAGE_HEIGHT}px;
  margin-bottom: 80px;
`;

export default GalleryContainer;
