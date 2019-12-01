import React from 'react';
import { Row } from 'antd'
import GameCard from './GameCard.js'
import './App.css';
import "antd/dist/antd.css";

class GameContainer extends React.Component {

  renderCards = () => {
    let cardRows = [];
    let row = [];
    for(const game of this.props.gameInfo) {
      if(row.length < 6) {
        row.push(<GameCard key={game.id} gameInfo={game} handleClick={this.props.handleCardClick}></GameCard>);
      } else {
        cardRows.push(<Row key={cardRows.length} gutter={[16, 16]} type="flex">{row}</Row>);
        row = [];
        row.push(<GameCard key={game.id} gameInfo={game} handleClick={this.props.handleCardClick}></GameCard>);
      }
    }
    cardRows.push(<Row key={cardRows.length} gutter={[16, 16]} type="flex">{row}</Row>);
    return cardRows;
  }

  render() {
    return (
        <div className="cardContainer">
            {this.renderCards()}
        </div>
    );
  }
}

export default GameContainer;
