import React from 'react';
import { Modal } from 'antd'
import './App.css';
import "antd/dist/antd.css";

class GameModal extends React.Component {

  renderLogin = () => {
    return;
  }

  renderSignup = () => {
    return;
  }

  render() {
    const game = this.props.game;
    return (
        <Modal
            title={game.name}
            visible={this.props.visible}
            onCancel={this.props.handleCancel}
            onOk={this.props.handleCancel}
            okText="Write Review"
            cancelText="Close"
        >
        </Modal>
    );
  }
}

export default GameModal;
