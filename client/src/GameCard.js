import React from 'react';
import { Card, Col } from 'antd'
import "antd/dist/antd.css";
import "./GameCard.css"
import "./App.css"

const { Meta } = Card;

class GameCard extends React.Component {

    onClick = () => {
        this.props.handleClick(this.props.gameInfo);
    }
  
    render() {
        const gameInfo = this.props.gameInfo;
        return (
            <Col span={8}>
                <Card
                    className="gameCard"
                    hoverable
                    onClick={this.onClick}
                    cover={<img alt={gameInfo.name} src={gameInfo.imgURL} />}
                >
                    <Meta className="cardInfo" title={gameInfo.name} description={gameInfo.developer} />
                </Card>
            </Col>
        );
    }
  }
  
  export default GameCard;