import { useState } from "react";
import styled from "styled-components";

const TitleInput = () => {
  const [title, setTitle] = useState("");

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
  border-left: 1px solid rgb(198, 198, 198);
  border-radius: 4px 4px 0 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  line-height: 20px;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-position: right 8px center;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: inset 0 1px 0 rgba(208, 215, 222, 0.2);
  transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
  transition-property: color, background-color, box-shadow, border-color;

  &:not(:focus) {
    background-color: #f6f8fa;
  }
`;

export default TitleInput;
