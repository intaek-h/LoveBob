import styled from "styled-components";

export const TitleInput = styled.input`
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
    background-color: ${({ theme }) => theme.element.input_blur};
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 30px;

  label {
    margin-bottom: 5px;
    font-weight: 500;
  }

  input,
  textarea {
    font-size: 0.95rem;
    width: 100%;
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.element.monochrome_2};
    border-radius: 4px;
  }

  input {
  }

  textarea {
    height: 100px;
    resize: none;
  }
`;
