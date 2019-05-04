import PanZoomController from "./panZoomCtrl";
import { PanZoomOptions, BBox } from "../types";
import Transform from "../utils/transform";

export default class SvgController extends PanZoomController {
  constructor(
    private svgElement: SVGGraphicsElement,
    private options: PanZoomOptions
  ) {
    super();
    if (!(svgElement instanceof SVGGraphicsElement)) {
      throw new Error("Pan zoom only works on svg or HTMLElement");
    }

    this.owner = svgElement.ownerSVGElement;

    if (!this.owner) {
      throw new Error(
        "Donot apply panzoom to <svg> element. Apply it on its child instead"
      );
    }
  }

  public getBoundingBox(): BBox {
    var bbox = this.svgElement.getBBox();
    return {
      left: bbox.x,
      top: bbox.y,
      width: bbox.width,
      height: bbox.height
    };
  }

  public getScreenCTM(): DOMMatrix {
    return (this.owner as SVGSVGElement).getScreenCTM();
  }

  public applyTransform(transform: Transform) {
    this.svgElement.setAttribute(
      "transform",
      `matrix(
          ${transform.scale} 0 0 ${transform.scale}
          ${transform.x} ${transform.y}
        )`
    );
  }

  public initTransform(transform: Transform) {
    var screenCTM = this.svgElement.getScreenCTM();
    transform.x = screenCTM.e;
    transform.y = screenCTM.f;
    transform.scale = screenCTM.a;
    this.owner.removeAttributeNS(null, "viewBox");
  }

  public getSvgTransformMatrix(): SVGTransform {
    const baseVal = this.svgElement.transform.baseVal;
    if (baseVal.numberOfItems) return baseVal.getItem(0);
    const transform = (this.owner as SVGSVGElement).createSVGTransform();
    this.svgElement.transform.baseVal.appendItem(transform);
    return transform;
  }
}
