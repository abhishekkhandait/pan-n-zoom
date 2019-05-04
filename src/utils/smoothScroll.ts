import { Scene } from "../scene";
import { Point } from "../types";

/**
 * Allows smooth kinetic scrolling of the surface
 */
export class SmoothScroll {
  private minVelocity = 5;
  private amplitude = 0.25;
  private timeConstant = 342;
  private lastPoint: Point;
  private timeStamp: Date;
  private ticker: number;
  private raf: number;
  private amp: Point;
  private velocity: Point;
  private target: Point;

  constructor(private scene: Scene) {}

  public start() {
    this.lastPoint = this.getCurrentTransformPoint();

    this.reset();
    this.timeStamp = new Date();

    window.clearInterval(this.ticker);
    window.cancelAnimationFrame(this.raf);

    // we start polling the point position to accumulate velocity
    // Once we stop(), we will use accumulated velocity to keep scrolling
    // an object.
    this.ticker = window.setInterval(this.track, 100);
  }

  public stop() {
    window.clearInterval(this.ticker);
    window.cancelAnimationFrame(this.raf);

    const currentPoint = this.getCurrentTransformPoint();
    this.target = currentPoint;

    this.timeStamp = new Date();

    if (
      this.velocity.x < -this.minVelocity ||
      this.velocity.x > this.minVelocity
    ) {
      this.amp.x = this.amplitude * this.velocity.x;
      this.target.x += this.amp.x;
    }

    if (
      this.velocity.y < -this.minVelocity ||
      this.velocity.y > this.minVelocity
    ) {
      this.amp.y = this.amplitude * this.velocity.y;
      this.target.y += this.amp.y;
    }

    this.raf = window.requestAnimationFrame(this.autoScroll);
  }

  public cancel() {
    window.clearInterval(this.ticker);
    window.cancelAnimationFrame(this.raf);
  }

  private track = () => {
    const now = new Date();
    const elapsed = now.valueOf() - this.timeStamp.valueOf();
    this.timeStamp = now;

    const currentPoint = this.getCurrentTransformPoint();

    const d = {
      x: currentPoint.x - this.lastPoint.x,
      y: currentPoint.y - this.lastPoint.y
    };

    this.lastPoint = currentPoint;

    const dt = 1000 / (1 + elapsed);

    // moving average
    this.velocity = {
      x: 0.8 * d.x * dt + 0.2 * this.velocity.x,
      y: 0.8 * d.y * dt + 0.2 * this.velocity.y
    };
  };

  private autoScroll() {
    const elapsed = new Date().valueOf() - this.timeStamp.valueOf();

    let moving = false;
    const d = { x: 0, y: 0 };

    if (this.amp.x) {
      d.x = -this.amp.x * Math.exp(-elapsed / this.timeConstant);

      if (d.x > 0.5 || d.x < -0.5) moving = true;
      else d.x = this.amp.x = 0;
    }

    if (this.amp.y) {
      d.y = -this.amp.y * Math.exp(-elapsed / this.timeConstant);

      if (d.y > 0.5 || d.y < -0.5) moving = true;
      else d.y = this.amp.y = 0;
    }

    if (moving) {
      this.scene.moveTo({ x: this.target.x + d.x, y: this.target.y + d.y });
      this.raf = window.requestAnimationFrame(this.autoScroll);
    }
  }

  private getCurrentTransformPoint(): Point {
    return {
      x: this.scene.transform.x,
      y: this.scene.transform.y
    };
  }

  private reset() {
    this.amp = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
  }
}
