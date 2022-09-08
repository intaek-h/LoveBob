import { useEffect } from "react";
import styled from "styled-components";
import { useBoundStore } from "../../store";
import { TitleInput as Input } from "../../styled-components/inputs";

const TitleInput = () => {
  const title = useBoundStore((state) => state.title);
  const setTitle = useBoundStore((state) => state.updateTitle);

  useEffect(() => {
    return () => setTitle("");
  }, [setTitle]);

  return (
    <Container>
      <Input
        placeholder="제목"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 15px;
  border-top: 1px solid rgb(198, 198, 198);
  border-left: 1px solid rgb(198, 198, 198);
  border-right: 1px solid rgb(198, 198, 198);
  border-radius: 4px 4px 0 0;
`;

export default TitleInput;
