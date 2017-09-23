import React from "react";
import ReactDOM from "react-dom";

import Header from "./Components/Header";

import "./theme.scss";

ReactDOM.render(
	<main>
		<Header title="Search drops">
			<input type="search" placeholder="Search card name" />
		</Header>
	</main>,
	document.getElementById("app")
);