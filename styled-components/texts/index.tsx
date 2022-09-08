import styled from "styled-components";

export const ErrorMsg = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.error_red};
`;

export const SuccessMsg = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.highlight_blue};
`;
