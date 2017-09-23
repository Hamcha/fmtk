import React from "react";
import PropTypes from "prop-types";

// Hack around iOS Web App quirky behavior with hyperlinks
export default class Link extends React.PureComponent {
	static propTypes = {
		external: PropTypes.bool,
		target:   PropTypes.string.isRequired,
		children: PropTypes.node
	};

	static defaultProps = {
		external: false
	};

	handleClick(e: Event) {
		e.preventDefault();
		document.location.href = this.props.target;
	}

	render(): any {
		if (this.props.external) {
			return <a href={this.props.target}>{this.props.children}</a>;
		}
		return <a onClick={this.handleClick.bind(this)}>{this.props.children}</a>;
	}
}