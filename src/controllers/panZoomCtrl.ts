import { HTMLScrollbar } from "../scrollbar/htmlScrollbar";
import { BBox } from "../types";
import Transform from "../utils/transform";

export default abstract class PanZoomController {
	protected owner: SVGSVGElement | HTMLElement;
	protected scrollbar: HTMLScrollbar;

	public getOwner() {
		return this.owner;
	}

	public get Scrollbar() {
		return this.scrollbar;
	}
	public abstract getBoundingBox(): BBox;
	public abstract applyTransform(transform: Transform): void;
}
