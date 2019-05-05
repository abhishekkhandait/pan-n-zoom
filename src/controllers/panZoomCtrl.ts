import { BBox } from "../types";
import Transform from "../utils/transform";

export default abstract class PanZoomController {
  protected owner: SVGSVGElement | HTMLElement;

  public getOwner() {
    return this.owner;
  }
  public abstract getBoundingBox(): BBox;
  public abstract applyTransform(transform: Transform): void;
}
