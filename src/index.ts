import Scene from "./scene";
import { PanZoomOptions } from "./types";

export const init = (
  element: HTMLElement | SVGElement,
  panZoomOption: PanZoomOptions
) => {
  const scene = new Scene(element, panZoomOption);
  return scene;
};
