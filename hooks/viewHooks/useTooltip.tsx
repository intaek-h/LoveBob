import { RefObject, useEffect } from "react";

interface Options {
  placement: "top" | "bottom";
  width: number;
  text: string;
  deltaY?: number;
  deltaX?: number;
}

type ExtraDeps = any;

const useToolTip = (
  elementRef: RefObject<HTMLElement>,
  options: Options,
  ...extraDependencies: ExtraDeps
) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const rootElement = elementRef.current;

    const handleMouseEnter = (e: MouseEvent) => {
      const tooltip = document.createElement("div");
      const rootElementFigures = rootElement.getBoundingClientRect();

      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "#0000009d";
      tooltip.style.padding = "5px 8px";
      tooltip.style.fontSize = "0.8rem";
      tooltip.style.lineHeight = "1.3";
      tooltip.style.color = "#ffffff";
      tooltip.style.borderRadius = "3px";
      tooltip.style.left = -(options.width / 2) + rootElementFigures.width / 2 + "px";
      tooltip.textContent = options.text;
      tooltip.style.width = options.width + "px";
      // @ts-ignore
      tooltip.style.backdropFilter = `blur(5px)`;

      if (options.placement === "top") {
        tooltip.style.top = -(options.deltaY ?? 5) - rootElementFigures.height + "px";
      } else if (options.placement === "bottom") {
        tooltip.style.top = rootElementFigures.height + (options.deltaY ?? 5) + "px";
      }

      rootElement.appendChild(tooltip);

      const handleMouseLeave = (e: MouseEvent) => {
        tooltip.remove();
      };

      rootElement.addEventListener("mouseleave", handleMouseLeave, { once: true });
    };

    rootElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      rootElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [
    elementRef,
    options.deltaY,
    options.placement,
    options.text,
    options.width,
    extraDependencies,
  ]);
};

export default useToolTip;
