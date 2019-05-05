import DomController from "./controllers/dom";
import PanZoomController from "./controllers/panZoomCtrl";
import SvgController from "./controllers/svg";
import MouseEventsHandler from "./handlers/mouseHandler";
import TouchEventsHandler from "./handlers/touchHandler";
import { PanZoomOptions, Point } from "./types";
import EventEmitter from "./utils/eventEmitter";
import SmoothScroll from "./utils/smoothScroll";
import Transform from "./utils/transform";

export default class Scene {
  public transform: Transform = {
    scale: 1,
    x: 0,
    y: 0
  };
  public readonly owner: HTMLElement | SVGElement;
  public readonly eventEmitter: EventEmitter;
  public touchInProgress: boolean = false;
  public multitouchActive: boolean = false;
  public mousePt: Point;
  public smoothScroll: SmoothScroll;

  private controller: PanZoomController;
  private mouseHandler: MouseEventsHandler;
  private touchHandler: TouchEventsHandler;

  private currentTransformedPoint: Point = {
    x: 0,
    y: 0
  };

  private isDirty = false;
  private frameAnimation: number;

  constructor(
    private element: HTMLElement | SVGElement,
    public readonly options: PanZoomOptions = {}
  ) {
    this.transform = new Transform();

    this.createController();
    this.owner = this.controller.getOwner();

    this.mouseHandler = new MouseEventsHandler(this);
    this.touchHandler = new TouchEventsHandler(this);
    this.eventEmitter = new EventEmitter();
    this.smoothScroll = new SmoothScroll(this);

    this.mouseHandler.activate();
    this.touchHandler.activate();

    this.makeDirty();
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

    this.eventEmitter.emit("pan");
    this.makeDirty();
  }

  public zoomTo(point: Point, scaleMultiplier: number) {
    const newScale = this.transform.scale * scaleMultiplier;
    if (newScale < this.options.minZoom) {
      if (this.transform.scale === this.options.minZoom) {
        return;
      }

      scaleMultiplier = this.options.minZoom / this.transform.scale;
    }
    if (newScale > this.options.maxZoom) {
      if (this.transform.scale === this.options.maxZoom) {
        return;
      }

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

    this.makeDirty();
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

  private createController() {
    if (this.element instanceof SVGGraphicsElement) {
      this.controller = new SvgController(this.element, this.options);
      (this.controller as SvgController).initTransform(this.transform);
    }

    if (this.element instanceof HTMLElement) {
      this.controller = new DomController(this.element, this.options);
    }
  }

  private applyTransform() {
    this.isDirty = false;

    // TODO: Should I allow to cancel this?
    this.controller.applyTransform(this.transform);

    this.eventEmitter.emit("transform");
    this.frameAnimation = 0;
  }

  private frame = () => this.isDirty && this.applyTransform();

  private makeDirty() {
    this.isDirty = true;
    this.frameAnimation = window.requestAnimationFrame(this.frame);
  }

  private isValidPoint(point: Point) {
    return !(isNaN(point.x) || isNaN(point.y));
  }
}
