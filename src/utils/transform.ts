import { Point } from "../types";

export default class Transform {
	public static getOffsetXY(
		e: MouseEvent | Touch,
		el: HTMLElement | SVGElement
	): Point {
		const ownerRect = el.getBoundingClientRect();
		const offsetX = e.clientX - ownerRect.left;
		const offsetY = e.clientY - ownerRect.top;

		return { x: offsetX, y: offsetY };
	}

	public static getScreenCTM(svgElement: SVGSVGElement): DOMMatrix {
		return svgElement.getScreenCTM();
	}

	constructor(public x = 0, public y = 0, public scale = 1) {}
}
