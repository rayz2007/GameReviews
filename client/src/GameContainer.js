import React from 'react';
import { Row, Col, Button } from 'antd'
import GameCard from './GameCard.js'
import AddGameModal from './AddGameModal.js'
import './App.css';
import "antd/dist/antd.css";

class GameContainer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            addGameVisible: false,
            newGame: {}
        };
    }

    renderCards = () => {
        let cardRows = [];
        let row = [];
        for(const game of this.props.gameInfo) {
            if(row.length < 3) {
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

    handleAddClick = (e) => {
        this.setState({
            addGameVisible: true
        })
    }

    handleOk = () => {
        console.log(this.state.newGame);
        this.setState({
            addGameVisible: false
        });
    }

    handleCancel = () => {
        this.setState({
            addGameVisible: false
        });
    }

    handleGameInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        this.setState(prevState => ({
            newGame: {
                ...prevState.newGame,
                [id]: value
            }
        }));
    }

    render() {
        return (
            <div className="cardContainer">
                <AddGameModal
                    visible={this.state.addGameVisible}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    handleUserInput={this.handleGameInput}
                ></AddGameModal>
                <Row gutter={[16, 16]} type="flex">
                    <Col span={12}>
                        <Button type="primary" className="addGameButton" onClick={this.handleAddClick}>Add Game</Button>
                    </Col>
                </Row>
                {this.renderCards()}
            </div>
        );
    }
}

export default GameContainer;
