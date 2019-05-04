import PanZoomController from "./controllers/panZoomCtrl";
import { PanZoomOptions, Point } from "./types";
import SvgController from "./controllers/svg";
import { EventEmitter } from "./utils/eventEmitter";
import Transform from "./utils/transform";
import { SmoothScroll } from "./utils/smoothScroll";
import { MouseEventsHandler } from "./handlers/mouseHandler";
import { TouchEventsHandler } from "./handlers/touchHandler";

export class Scene {
  public transform: Transform;
  public readonly owner: HTMLElement | SVGElement;
  public readonly eventEmitter: EventEmitter;
  public touchInProgress: boolean = false;
  public multitouchActive: boolean = false;
  public mousePt: Point;

  private controller: PanZoomController;
  private mouseHandler: MouseEventsHandler;
  private touchHandler: TouchEventsHandler;
  public smoothScroll: SmoothScroll;

  private currentTransformedPoint: Point = {
    x: 0,
    y: 0
  };

  constructor(
    private element: HTMLElement | SVGElement,
    public readonly options: PanZoomOptions = {}
  ) {
    this.transform = new Transform();
    this.mouseHandler = new MouseEventsHandler(this);
    this.touchHandler = new TouchEventsHandler(this);
    this.eventEmitter = new EventEmitter();
    this.smoothScroll = new SmoothScroll(this);

    this.mouseHandler.activate();
    this.touchHandler.activate();
  }

  public moveBy(dx: number, dy: number) {
    this.moveTo({
      x: this.transform.x + dx,
      y: this.transform.y + dy
    });
  }

  public moveTo(point: Point) {
    this.transform.x = point.x;
    this.transform.y = point.y;
  }

  public zoomTo(point: Point, scaleMultiplier: number) {
    const newScale = this.transform.scale * scaleMultiplier;
    if (newScale < this.options.minZoom) {
      if (this.transform.scale === this.options.minZoom) return;

      scaleMultiplier = this.options.minZoom / this.transform.scale;
    }
    if (newScale > this.options.maxZoom) {
      if (this.transform.scale === this.options.maxZoom) return;

      scaleMultiplier = this.options.maxZoom / this.transform.scale;
    }

    const screenPt = this.transformToScreen(point);

    this.transform.x =
      screenPt.x - scaleMultiplier * (screenPt.x - this.transform.x);
    this.transform.y =
      screenPt.y - scaleMultiplier * (screenPt.y - this.transform.y);

    // const transformAdjusted = this.keepTransformInsideBounds();
    // if (!transformAdjusted) transform.scale *= ratio;
    this.transform.scale *= scaleMultiplier;

    this.eventEmitter.emit("zoom");

    // makeDirty();
  }

  public triggerPanStart() {
    this.eventEmitter.emit("panstart", this);
    this.smoothScroll.start();
  }

  public triggerPanEnd() {
    // we should never run smooth scrolling if it was multiTouch (pinch zoom animation):
    if (!this.multitouchActive) {
      this.smoothScroll.stop();
    }
    this.eventEmitter.emit("panend", this);
  }

  public transformToScreen(point: Point) {
    if (this.controller instanceof SvgController) {
      const parentCTM = this.controller.getScreenCTM();
      const parentScaleX = parentCTM.a;
      const parentScaleY = parentCTM.d;
      const parentOffsetX = parentCTM.e;
      const parentOffsetY = parentCTM.f;
      this.currentTransformedPoint = {
        x: point.x * parentScaleX - parentOffsetX,
        y: point.y * parentScaleY - parentOffsetY
      };
    } else {
      this.currentTransformedPoint = point;
    }

    return this.currentTransformedPoint;
  }

  private isValidPoint(point: Point) {
    return !(isNaN(point.x) || isNaN(point.y));
  }
}
