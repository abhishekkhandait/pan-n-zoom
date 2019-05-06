import "./scrollbar.scss";

export interface ScrollSettings {
	vScroll: boolean;
	hScroll: boolean;
}

export class HTMLScrollbar {
	private htrack: HTMLElement;
	private hthumb: HTMLElement;
	private vtrack: HTMLElement;
	private vthumb: HTMLElement;

	public constructor(private container: HTMLElement, private content: HTMLElement, private options?: ScrollSetting) {
		this.createScrollbar();
	}

	public show(scrolltype?: "vertical" | "horizontal") {
		if (scrolltype) {
			scrolltype === "horizontal" ? this.htrack.classList.remove("inactive") : this.vtrack.classList.add("inactive");
			scrolltype === "vertical" ? this.vtrack.classList.remove("inactive") : this.htrack.classList.add("inactive");
		} else {
			this.htrack.classList.remove("inactive");
			this.vtrack.classList.remove("inactive");
		}
	}

	public hide() {
		this.htrack.classList.add("inactive");
		this.vtrack.classList.add("inactive");
	}

	public scrollthumbSize() {
		const contentBBox = this.content.getBoundingClientRect();
		const containerBBox = this.container.getBoundingClientRect();
		const hScrollWidth = this.container.offsetWidth;
		const vScrollHeight = this.container.offsetHeight;

		const hThumbWidth = (1 - (contentBBox.width - hScrollWidth) / contentBBox.width) * hScrollWidth;
		this.hthumb.style.width = `${hThumbWidth}px`;
		const relativeLeft = hScrollWidth - hThumbWidth;
		const dx = ((containerBBox.left - contentBBox.left) / contentBBox.width) * relativeLeft;
		this.hthumb.style.left = `${dx}px`;

		const vThumbHeight = (1 - (contentBBox.height - vScrollHeight) / contentBBox.height) * vScrollHeight;
		this.vthumb.style.height = `${vThumbHeight}px`;
		const relativeTop = vScrollHeight - vThumbHeight;
		const dy = ((containerBBox.top - contentBBox.top) / contentBBox.height) * relativeTop;
		this.vthumb.style.top = `${dy}px`;
	}

	private createScrollbar() {
		this.htrack = document.createElement("div");
		this.htrack.classList.add("panzoom-scroll-track", "___h-track", "inactive");

		this.hthumb = document.createElement("div");
		this.hthumb.classList.add("panzoom-scroll-thumb");

		this.htrack.appendChild(this.hthumb);

		this.vtrack = document.createElement("div");
		this.vtrack.classList.add("panzoom-scroll-track", "___v-track", "inactive");

		this.vthumb = document.createElement("div");
		this.vthumb.classList.add("panzoom-scroll-thumb");

		this.vtrack.appendChild(this.vthumb);

		this.container.appendChild(this.htrack);
		this.container.appendChild(this.vtrack);
	}
}
