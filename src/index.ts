import { PanZoomOptions } from "./types";
import { Scene } from "./scene";

export const init = (
  element: HTMLElement | SVGElement,
  panZoomOption: PanZoomOptions
) => {
  const scene = new Scene(element, panZoomOption);
  return scene;
};
