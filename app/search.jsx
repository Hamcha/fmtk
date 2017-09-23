import React from "react";
import ReactDOM from "react-dom";

import Header from "./Components/Header";
import CardInfo from "./Components/CardInfo";

import "./theme.scss";

class SearchPage extends React.Component {
	render(): any {
		return <main>
			<Header title="Search cards">
				<input type="search" placeholder="Search card name" results />
			</Header>
			<CardInfo ID="1" />
			<hr />
			<CardInfo ID="685" />
		</main>;
	}
}

ReactDOM.render(
	<SearchPage />,
	document.getElementById("app")
);