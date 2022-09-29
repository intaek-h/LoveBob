import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
import styled from "styled-components";

interface Props {
  items: ReactImageGalleryItem[];
}

const ImageCarousel = ({ items }: Props) => {
  return (
    <ImageGallery
      items={items}
      showThumbnails={false}
      autoPlay={false}
      showFullscreenButton={false}
      showPlayButton={false}
      slideDuration={150}
      showIndex
      renderLeftNav={(onclick, disabled) => {
        return (
          <NavLeftIcon onClick={onclick} disabled={disabled}>
            <LeftInnerIcon>
              <span className="material-symbols-outlined">navigate_before</span>
            </LeftInnerIcon>
          </NavLeftIcon>
        );
      }}
      renderRightNav={(onclick, disabled) => {
        return (
          <NavRightButton onClick={onclick} disabled={disabled}>
            <RightInnerIcon>
              <span className="material-symbols-outlined">navigate_next</span>
            </RightInnerIcon>
          </NavRightButton>
        );
      }}
    />
  );
};

const NavLeftIcon = styled.button`
  appearance: none;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  height: 100%;
  width: 100px;
  z-index: 4;

  &:hover {
    div {
      backdrop-filter: contrast(0.9);
      transition: 0.3s ease;
    }
  }
`;

const NavRightButton = styled.button`
  appearance: none;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  height: 100%;
  width: 100px;
  z-index: 4;

  &:hover {
    div {
      backdrop-filter: contrast(0.9);
      transition: 0.3s ease;
    }
  }
`;

const LeftInnerIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  backdrop-filter: contrast(0.95);

  span {
    color: ${({ theme }) => theme.text.monochrome_3};
  }
`;

const RightInnerIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  backdrop-filter: contrast(0.95);

  span {
    color: ${({ theme }) => theme.text.monochrome_3};
  }
`;

export default ImageCarousel;
