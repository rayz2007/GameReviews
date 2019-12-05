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

    getAverageScore = () => {
        let sum = 0;
        for(let review of this.props.reviews) {
            sum += review.rating;
        }
        return Math.round((sum / this.props.reviews.length) * 10) / 10
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
                <div style={{display: "flex"}}>
                    <div style={{margin: "0 10px"}}>
                        <img className="modalImage" src={game.photoURL}/>
                    </div>
                    <div>
                        <h2>{game.developer}</h2>
                        <h3>{game.publisher}</h3>
                        <h4>{game.year}</h4>
                        <h5>{game.genre}</h5>
                        <h2>{"Average rating: " + this.getAverageScore()}</h2>
                    </div>
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
                        />
                    ))}
                </div>
            </Modal>
        );
    }
}

export default GameModal;
