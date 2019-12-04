import React from 'react';
import { Modal, Avatar, Comment, Rate, Input, Checkbox } from 'antd'
import './App.css';
import "antd/dist/antd.css";

const { TextArea } = Input;

const baseUrl = 'https://api.gamereviewz.me/v1/';

class GameModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reviewFormVisible: false,
            newReview: {},
            reviewOptions: ["PC", "PS4", "Xbox One", "Switch", "PS3", "Xbox 360", "Wii U"]
        }
    }

    
    handleOptionsChange = selected => {
        this.setState({reviewOptions: selected});
    }

    filterReviews = () => {
        let standardOptions = this.state.reviewOptions.map(option => {
            let lower = option.toLowerCase();
            return lower.replace(/\s/g, '');
        });
        const reviews = this.props.reviews;
        let filteredReviews = [];

        for(let review of reviews) {
            if(standardOptions.includes(review.platform.toLowerCase().replace(/\s/g, ''))){
                filteredReviews.push(review);
            }
        }
        console.log(filteredReviews);
        return filteredReviews;
    }
    

    render() {
        const options = ["PC", "PS4", "Xbox One", "Switch", "PS3", "Xbox 360", "Wii U"]
        const game = this.props.game;
        return (
            <Modal
                title={game.name}
                visible={this.props.visible}
                onCancel={this.props.handleCancel}
                onOk={this.props.handleReviewClick}
                okButtonProps={{ disabled: this.props.userToken === null }}
                okText="Write Review"
                cancelText="Close"
            >
                <div>
                    <img src={game.photoURL}/>
                    <h2>{game.developer}</h2>
                    <h3>{game.publisher}</h3>
                    <h4>{game.year}</h4>
                    <h5>{game.genre}</h5>
                </div>
                <div>
                    <Rate allowHalf onChange={this.props.onStarChange}/>
                    <Input id="platform" placeholder="Platform" onChange={this.props.onReviewChange}></Input>
                    <TextArea id="body" rows={4} onChange={this.props.onReviewChange}/>
                </div>
                <div>
                    <Checkbox.Group
                        options={options}
                        defaultValue={options}
                        onChange={this.handleOptionsChange}
                    />
                    {this.filterReviews().map((review, index) => (
                        <Comment
                            key={index}
                            author={<span>{review.creator.userName}</span>}
                            avatar={
                            <Avatar
                                src={review.creator.photoURL}
                                alt={review.creator.userName}
                            />
                            }
                            content={
                            <div>
                            <h5>{review.rating + "/5"}</h5>
                            <h5>{review.platform}</h5>
                            <p>
                                {review.body}
                            </p>
                            </div>
                            }
                            //datetime={<span>{review.createdAt && review.createdAt.toLocaleDateString("en-US")}</span>}
                        />
                    ))}
                </div>
            </Modal>
        );
    }
}

export default GameModal;
