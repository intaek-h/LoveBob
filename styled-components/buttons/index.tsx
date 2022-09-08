import { darken } from "polished";
import styled from "styled-components";

export const PaddedButton = styled.button`
  display: block;
  text-align: center;
  appearance: none;
  border: none;
  padding: 0;
  width: 100%;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid;
  border-color: rgba(27, 31, 36, 0.15);
  background-color: ${({ theme }) => theme.element.green_prism_2};
  box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
  transition-property: color, background-color, box-shadow, border-color;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.element.green_prism_2)};
    border-color: rgba(27, 31, 36, 0.15);
    transition-duration: 0.1s;
  }
`;

export const PaddedLabel = styled.label`
  display: block;
  text-align: center;
  appearance: none;
  border: none;
  padding: 0;
  width: 100%;
  padding: 7px 0;
  margin-bottom: 15px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid;
  border-color: rgba(27, 31, 36, 0.15);
  background-color: ${({ theme }) => theme.element.green_prism_2};
  box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
  transition-property: color, background-color, box-shadow, border-color;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.element.green_prism_2)};
    border-color: rgba(27, 31, 36, 0.15);
    transition-duration: 0.1s;
  }
`;
