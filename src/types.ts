export interface PanZoomOptions {
  el: HTMLElement | SVGElement;
  minZoom: number;
  maxZoom: number;
}

export interface BBox {
  left: number;
  top: number;
  width: number;
  height: number;
}
