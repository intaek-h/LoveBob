import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

interface Props {
  children?: ReactNode;
  show: boolean;
}

const Modal = ({ show, children }: Props) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const modalContent = show ? <Overlay>{children}</Overlay> : null;

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById("modal")!);
  } else {
    return null;
  }
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export default Modal;
