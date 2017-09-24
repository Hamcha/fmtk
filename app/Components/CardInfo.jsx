import React from "react";
import PropTypes from "prop-types";

import styles from "./CardInfo.module.scss";

import cards from "../data/cards";
import type { Card } from "../data/cards";

const guardianStarSymbols = {
	"Sun": "☉",
	"Mercury": "☿",
	"Venus": "♀",
	"Moon": "☾",
	"Mars": "♂",
	"Jupiter": "♃",
	"Saturn": "♄",
	"Neptune": "♆",
	"Uranus": "⛢",
	"Pluto": "♇"
};

export default class CardInfo extends React.PureComponent {
	static propTypes = {
		ID: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.cardData = cards[props.ID];
	}

	componentWillUpdate(newprops) {
		this.cardData = cards[newprops.ID];
	}

	cardData: Card;

	render(): any {
		const imageURL = "/res/cards/" + this.cardData.ImageID;

		let pairs = [];
		let stars = null;
		let levelstars = null;
		let magicLore = null;
		let monsterLore = null;

		if (this.cardData.CardType === "Monster") {
			pairs.push(
				{ title: "ATK", data: this.cardData.ATK },
				{ title: "DEF", data: this.cardData.DEF }
			);

			stars = this.cardData.GuardianStars.split(",").map(star => 
				<div key={star} className={styles.guardianStar}>
					{guardianStarSymbols[star]}
				</div>
			);

			let levelstarelems = [];
			for (let i = 0; i < this.cardData.Level; ++i) {
				levelstarelems.push(<img src="/res/icons/star.svg" />);
			}
			levelstars = <div className={styles.cardLevel}>{levelstarelems}</div>;
			monsterLore = <p className={styles.lore}>{this.cardData.Lore}</p>;
		} else {
			magicLore = <p className={styles.effect}>{this.cardData.Lore}</p>;
		}


		return <div className={styles.cardRoot}>
			<section className={styles.cardData}>
				<div className={styles.imgSection}>
					<img className={styles.cardImage} src={imageURL} />
					<div className={styles.guardianStars}>
						{stars}
					</div>
				</div>
				<article className={styles.cardInfo}>
					<div className={styles.cardTitle}>{this.cardData.Name}</div>
					{levelstars}
					{magicLore}
					<div className={styles.infopairs}>
						{pairs.map(data => <div key={data.title} className={styles.pair}>
							<div className={styles.title}>{data.title}</div>
							<div>{data.data}</div>
						</div>)}
					</div>
				</article>
			</section>
			{monsterLore}
		</div>;
	}
}