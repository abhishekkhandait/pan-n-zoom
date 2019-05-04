import PanZoomController from "./panZoomCtrl";
import Transform from "../utils/transform";
import { BBox, PanZoomOptions } from "../types";

export class DomController extends PanZoomController {
  constructor(
    private domElement: HTMLElement,
    private options: PanZoomOptions
  ) {
    super();
    if (!(domElement instanceof HTMLElement)) {
      throw new Error("Pan zoom only works on svg or HTMLElement");
    }

    this.owner = domElement.parentElement;

    if (!this.owner) {
      throw new Error("Donot apply panzoom to detached DOM element");
    }
  }

  public getBoundingBox(): BBox {
    return {
      left: 0,
      top: 0,
      width: this.domElement.clientWidth,
      height: this.domElement.clientHeight
    };
  }

  public applyTransform(transform: Transform) {
    this.element.style.transformOrigin = "0 0 0";
    this.element.style.transform = `matrix(${transform.scale}, 0, 0, ${
      transform.scale
    }, ${transform.x}, ${transform.y})`;
  }
}
