import { Scene } from "../scene";
import Transform from "../utils/transform";

export class TouchEventsHandler {
  private pinchZoomLength: number;
  private pinchSpeed: number = 1;
  private lastTouchEndTime: Date;
  private doubleTapSpeedInMS: number = 300;
  private doubleTapZoomSpeed = 1.75;
  private multiTouch: boolean;

  constructor(private scene: Scene) {
    this.pinchSpeed = this.scene.options.pinchSpeed || 1;
  }

  public activate() {
    this.scene.owner.addEventListener("touchstart", this.onTouch);
  }

  public deactivate() {
    this.releaseTouchEvents();
    this.scene.owner.removeEventListener("touchstart", this.onTouch);
  }

  public onTouch = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      // return handleSingleFingerTouch(event, event.touches[0]);
      const touch = event.touches[0];
      const offset = Transform.getOffsetXY(touch, this.scene.owner);
      this.scene.mousePt = offset;

      // smoothScroll.cancel();

      this.addTouchListners();
    } else if (event.touches.length === 2) {
      // handleTouchMove() will care about pinch zoom.
      this.pinchZoomLength = this.getPinchZoomLength(
        event.touches[0],
        event.touches[1]
      );
      this.multiTouch = true;
      this.addTouchListners();
    }
  };

  public onTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      event.stopPropagation();
      const touch = event.touches[0];
      const offset = Transform.getOffsetXY(touch, this.scene.owner);
      const d = {
        x: offset.x - this.scene.mousePt.x,
        y: offset.y - this.scene.mousePt.y
      };

      if (d.x !== 0 && d.y !== 0) {
        this.scene.triggerPanStart();
      }
      this.scene.mousePt = offset;
      const point = this.scene.transformToScreen(d);
      this.scene.moveBy(point.x, point.y);
    } else if (event.touches.length === 2) {
      this.multiTouch = true;
      this.scene.multitouchActive = true;
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentPinchLength = this.getPinchZoomLength(touch1, touch2);

      const scaleMultiplier =
        1 + (currentPinchLength / this.pinchZoomLength - 1) * this.pinchSpeed;

      this.scene.mousePt = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };

      this.scene.zoomTo(this.scene.mousePt, scaleMultiplier);

      this.pinchZoomLength = currentPinchLength;
      event.stopPropagation();
      event.preventDefault();
    }
  };

  public onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      this.scene.mousePt = Transform.getOffsetXY(
        event.touches[0],
        this.scene.owner
      );
    } else {
      const now = new Date();
      if (
        now.valueOf() - this.lastTouchEndTime.valueOf() <
        this.doubleTapSpeedInMS
      ) {
        this.scene.zoomTo(this.scene.mousePt, this.doubleTapZoomSpeed);
      }

      this.lastTouchEndTime = now;

      this.scene.touchInProgress = false;
      this.scene.triggerPanEnd();
      this.releaseTouchEvents();
    }
  };

  private getPinchZoomLength(touch1: Touch, touch2: Touch): number {
    const x = touch1.clientX - touch2.clientX;
    const y = touch1.clientY - touch2.clientY;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  private addTouchListners() {
    if (!this.scene.touchInProgress) {
      this.scene.touchInProgress = true;
      document.addEventListener("touchmove", this.onTouchMove);
      document.addEventListener("touchend", this.onTouchEnd);
      document.addEventListener("touchcancel", this.onTouchEnd);
    }
  }

  private releaseTouchEvents() {
    document.removeEventListener("touchmove", this.onTouchMove);
    document.removeEventListener("touchend", this.onTouchEnd);
    document.removeEventListener("touchcancel", this.onTouchEnd);
    // panstartFired = false;
    this.multiTouch = false;
  }
}
