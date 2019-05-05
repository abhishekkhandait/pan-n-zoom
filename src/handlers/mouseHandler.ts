import Scene from "../scene";
import Transform from "../utils/transform";

export default class MouseEventsHandler {
	constructor(private scene: Scene) {}

	public activate() {
		this.scene.owner.addEventListener("mousedown", this.onMouseDown);
		this.scene.owner.addEventListener("wheel", this.onMouseWheel, {
			passive: false
		});
	}

	public deactivate() {
		this.removeDocumentEvents();
		this.scene.owner.removeEventListener("mousedown", this.onMouseDown);
		this.scene.owner.removeEventListener("wheel", this.onMouseWheel);
	}

	private onMouseDown = (event: MouseEvent) => {
		if (this.scene.touchInProgress) {
			// modern browsers will fire mousedown for touch events too
			// we do not want this: touch is handled separately.
			event.stopPropagation();
			return false;
		}
		// for IE, left click == 1
		// for Firefox, left click == 0
		const isLeftButton =
			(event.button === 1 && window.event !== null) || event.button === 0;
		if (!isLeftButton) {
			return;
		}

		// smoothScroll.cancel();

		const offset = Transform.getOffsetXY(event, this.scene.owner);
		this.scene.mousePt = this.scene.transformToScreen(offset);

		// We need to listen on document itself, since mouse can go outside of the
		// window, and we will loose it
		document.addEventListener("mousemove", this.onMouseMove);
		document.addEventListener("mouseup", this.onMouseUp);

		// preventTextSelection.capture(e.target || e.srcElement);

		return false;
	};

	private onMouseMove = (event: MouseEvent) => {
		// no need to worry about mouse events when touch is happening
		if (this.scene.touchInProgress) {
			return;
		}

		this.scene.triggerPanStart();

		const offset = Transform.getOffsetXY(event, this.scene.owner);
		const point = this.scene.transformToScreen(offset);
		const dx = point.x - this.scene.mousePt.x;
		const dy = point.y - this.scene.mousePt.y;

		this.scene.mousePt = point;

		this.scene.moveBy(dx, dy);
	};

	private onMouseUp = (event: MouseEvent) => {
		// preventTextSelection.release();
		this.scene.triggerPanEnd();
		this.removeDocumentEvents();
	};

	private onMouseWheel = (event: WheelEvent) => {
		this.scene.smoothScroll.cancel();

		const scaleMultiplier = this.getScaleMultiplier(event.deltaY);

		if (scaleMultiplier !== 1) {
			const offset = Transform.getOffsetXY(event, this.scene.owner);
			this.scene.zoomTo(offset, scaleMultiplier);
			event.preventDefault();
		}
	};

	private removeDocumentEvents() {
		document.removeEventListener("mousemove", this.onMouseMove);
		document.removeEventListener("mouseup", this.onMouseUp);
		// document.removeEventListener("wheel", this.onMouseWheel);
	}

	private getScaleMultiplier(delta: number, zoomSpeed: number = 0.035) {
		let scaleMultiplier = 1;

		if (delta < 0) {
			// zoom out
			scaleMultiplier = 1 - zoomSpeed;
		} else if (delta > 0) {
			// zoom in
			scaleMultiplier = 1 + zoomSpeed;
		}

		return scaleMultiplier;
	}
}
