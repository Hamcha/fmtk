import React from "react";
import PropTypes from "prop-types";

import styles from "./Header.module.scss";

const margin = 50;
const maxTitleSize = 30;
const minTitleSize = 18;

const maxTitleMargin = 20;
const minTitleMargin = 10;

export default class Header extends React.PureComponent {
	static propTypes = {
		title:    PropTypes.string.isRequired,
		children: PropTypes.node
	};

	wrapperElem: HTMLDivElement;
	headerElem: HTMLElement;
	supheadElem: HTMLDivElement;
	titleElem: HTMLHeadingElement;

	componentDidMount() {
		document.addEventListener("scroll", this.handleHeaderScroll.bind(this));
		this.handleHeaderScroll(null);
	}

	handleHeaderScroll() {
		let extraScroll = 0;

		// Hide top header line first
		let supheadscroll = Math.min(this.supheadElem.scrollHeight, window.scrollY);
		this.supheadElem.style.marginTop = (-supheadscroll)+"px";
		extraScroll += supheadscroll;

		// Resize title second
		let titleElemSize = Math.max(minTitleSize, Math.min(maxTitleSize, maxTitleSize - (window.scrollY - this.supheadElem.scrollHeight)));
		this.titleElem.style.fontSize = titleElemSize + "px";
		extraScroll -= titleElemSize;

		// Remove some margin last
		let titleMargin = Math.max(minTitleMargin, Math.min(maxTitleMargin, maxTitleMargin - (window.scrollY - this.supheadElem.scrollHeight)));
		this.headerElem.style.paddingBottom = titleMargin + "px";
		extraScroll -= titleMargin;

		if (window.scrollY > this.supheadElem.scrollHeight) {
			this.headerElem.classList.add("shrink");
		} else {
			this.headerElem.classList.remove("shrink");
		}

		// Fix-up body spacing
		this.wrapperElem.style.marginTop = (this.headerElem.scrollHeight + extraScroll + maxTitleMargin + margin) + "px";
	}

	render(): any {
		return <div className={styles.root} ref={(w) => this.wrapperElem = w}>
			<header ref={(h) => this.headerElem = h}>
				<div ref={(d) => this.supheadElem = d} className={styles.prehead}>YGO Forbidden Memories Toolkit</div>
				<h1 ref={(h) => this.titleElem = h}>{this.props.title}</h1>
				{this.props.children}
			</header>
		</div>;
	}
}