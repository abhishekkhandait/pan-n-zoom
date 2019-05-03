import Transform from "../utils/transform";
import { BBox } from "../types";

export default abstract class PanZoomController {
  protected owner: SVGSVGElement | HTMLElement;
  public readonly element: SVGElement | HTMLElement;

  public getOwner() {
    return this.owner;
  }
  public abstract getBoundingBox(): BBox;
  public abstract applyTransform(transform: Transform): void;
}
