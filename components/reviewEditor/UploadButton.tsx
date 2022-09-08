import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useRouter } from "next/router";
import { darken } from "polished";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useSession } from "../../hooks/queryHooks/useSession";
import ReviewService from "../../services/ReviewService";
import { useBoundStore } from "../../store";
import { PaddedButton } from "../../styled-components/buttons";
import { ErrorMsg } from "../../styled-components/texts";

interface Props {
  restaurantId: string;
}

const UploadButton = ({ restaurantId }: Props) => {
  const router = useRouter();
  const title = useBoundStore((state) => state.title);
  const images = useBoundStore((state) => state.images);
  const [error, setError] = useState("");
  const [editor] = useLexicalComposerContext();
  const [session] = useSession();

  const warnNoTitle = () =>
    toast("제목을 입력해주세요", {
      toastId: "warn-title",
      type: "error",
    });

  const warnNoBody = () =>
    toast("본문이 비었어요", {
      toastId: "warn-body",
      type: "error",
    });

  const handleClick = async () => {
    if (!title || title.length < 3) {
      warnNoTitle();
      return;
    }

    if (editor.getEditorState()._nodeMap.size < 3) {
      warnNoBody();
      return;
    }

    if (!restaurantId) return;

    const payload = {
      title,
      content: "",
      images: images.map((image) => image.url),
      userId: session.userId,
      restaurantId,
    };

    editor.update(() => {
      payload.content = $generateHtmlFromNodes(editor, null);
    });

    try {
      const response = await ReviewService.uploadReview(payload);

      if (response.success) {
        router.replace(`/users/${session.userId}`);
        return;
      }

      setError("요청을 수행하지 못했습니다");
    } catch (error) {
      setError("요청을 수행하지 못했습니다");
    }
  };

  return (
    <Container>
      <ErrorMsg>{error}</ErrorMsg>
      <Button onClick={handleClick}>작성하기</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled(PaddedButton)`
  width: 100px;
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

export default UploadButton;
