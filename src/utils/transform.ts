import { Point } from "../types";

export default class Transform {
  constructor(public x = 0, public y = 0, public scale = 1) {}

  public static getOffsetXY(
    e: MouseEvent | Touch,
    el: HTMLElement | SVGElement
  ): Point {
    var offsetX, offsetY;
    // I tried using e.offsetX, but that gives wrong results for svg, when user clicks on a path.
    var ownerRect = el.getBoundingClientRect();
    offsetX = e.clientX - ownerRect.left;
    offsetY = e.clientY - ownerRect.top;

    return { x: offsetX, y: offsetY };
  }

  public static getScreenCTM(svgElement: SVGSVGElement): DOMMatrix {
    return svgElement.getScreenCTM();
  }
}
