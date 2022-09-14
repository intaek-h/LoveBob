import styled from "styled-components";

interface LineProps {
  marginTop?: number;
  marginBot?: number;
}

export const Line = styled.div<LineProps>`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.element.placeholder};
  margin-top: ${({ marginTop }) => marginTop || 0}px;
  margin-bottom: ${({ marginBot }) => marginBot || 0}px;
`;
