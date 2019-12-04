import React from 'react';
import { Modal, Form, Icon, Input} from 'antd'
import './App.css';
import "antd/dist/antd.css";

class LoginModal extends React.Component {

    renderLogin = () => {
        return (
            <div>
                <Input
                    id="email"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Email"
                />
                <Input
                    id="password"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    onChange={this.props.handleUserInput}
                    type="password"
                    placeholder="Password"
                />
            </div>
        );
    }

    renderSignup = () => {
        return(
            <div>
                <Input
                    id="email"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Email"
                />
                <Input
                    id="password"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                />
                <Input
                    id="passwordConf"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Confirm Password"
                />
                <Input
                    id="userName"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                />
                <Input
                    id="firstName"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="up" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="First Name"
                />
                <Input
                    id="lastName"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="down" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Last Name"
                />
            </div>
        )
    }

    render() {
        return (
            <Modal
                title={this.props.form}
                visible={this.props.visible}
                onOk={this.props.handleOk}
                okText="Log In"
                onCancel={this.props.handleCancel}
            >
                {this.props.form === "Login" ? this.renderLogin() : this.renderSignup()}
            </Modal>
        );
    }
}

export default LoginModal;
