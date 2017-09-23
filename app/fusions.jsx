import React from "react";
import ReactDOM from "react-dom";

import Header from "./Components/Header";

import "./theme.scss";

ReactDOM.render(
	<main>
		<Header title="Fusion list" />
	</main>,
	document.getElementById("app")
);