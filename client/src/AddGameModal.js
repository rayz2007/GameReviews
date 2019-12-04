import React from 'react';
import { Modal, Form, Icon, Input} from 'antd'
import './App.css';
import "antd/dist/antd.css";

class AddGameModal extends React.Component {

    renderForm = () => {
        return(
            <div>
                <Input
                    id="name"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Title"
                />
                <Input
                    id="genre"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Genre"
                />
                <Input
                    id="publisher"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="team" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Publisher"
                />
                <Input
                    id="developer"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="code" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Developer"
                />
                <Input
                    id="year"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Year released"
                />
                <Input
                    id="photoURL"
                    onChange={this.props.handleUserInput}
                    prefix={<Icon type="picture" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Photo URL"
                />
            </div>
        )
    }

    render() {
        return (
            <Modal
                title="Add Game"
                visible={this.props.visible}
                onOk={this.props.handleOk}
                okText="Add Game"
                onCancel={this.props.handleCancel}
            >
                {this.renderForm()}
            </Modal>
        );
    }
}

export default AddGameModal;
