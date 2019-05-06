import "./scrollbar.scss";

export interface ScrollSettings {
	vScroll: boolean;
	hScroll: boolean;
}

export class HTMLScrollbar {
	public static create(container: HTMLElement, options?: ScrollSetting) {
		return new HTMLScrollbar(container, options);
	}

	private htrack: HTMLElement;
	private hthumb: HTMLElement;
	private vtrack: HTMLElement;
	private vthumb: HTMLElement;

	private constructor(private container: HTMLElement, private options?: ScrollSetting) {
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
