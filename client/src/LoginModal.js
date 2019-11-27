import React from 'react';
import { Modal } from 'antd'
import './App.css';
import "antd/dist/antd.css";

class LoginModal extends React.Component {

  renderLogin = () => {
    return;
  }

  renderSignup = () => {
    return;
  }

  render() {
    return (
        <Modal
            title={this.props.form}
            visible={this.props.visible}
            onOk={this.props.handleOk}
            onCancel={this.props.handleCancel}
        >
            {this.props.form === "Login" ? this.renderLogin() : this.renderSignup()}
        </Modal>
    );
  }
}

export default LoginModal;
