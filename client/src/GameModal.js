import React from 'react';
import { Modal, Avatar, Comment, Rate, Input } from 'antd'
import './App.css';
import "antd/dist/antd.css";

const { TextArea } = Input;

class GameModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reviews: [
                {
                    rating: 4,
                    platform: "PC",
                    body: "I enjoyed this game greatly. Very fun. I enjoyed this game greatly. Very fun. I enjoyed this game greatly. Very fun. I enjoyed this game greatly. Very fun.",
                    createdAt: new Date('December 17, 1995 03:24:00'),
                    creator: {
                        userName: "test1",
                        photoURL: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
                    }
                },
                {
                    rating: 3.5,
                    platform: "PC",
                    body: "I enjoyed this game greatly. Very fun. I enjoyed this game greatly. Very fun. I enjoyed this game greatly. Very fun. I enjoyed this game greatly. Very fun.",
                    createdAt: new Date('December 18, 2010 03:24:00'),
                    creator: {
                        userName: "test2",
                        photoURL: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
                    }
                }
            ],
            reviewFormVisible: false,
            newReview: {}
        }
    };

    fetchReviews = () => {
        return;
    }

    handleReviewClick = () => {
        console.log(this.state.newReview);
    }

    onStarChange = e => {
        this.setState(prevState => ({
            newReview: {
                ...prevState.newReview,
                rating: e
            }
        }));
    }

    onReviewChange = e => {
        const value = e.target.value;
        this.setState(prevState => ({
            newReview: {
                ...prevState.newReview,
                review: value
            }
        }));
    }

    render() {
        const game = this.props.game;
        return (
            <Modal
                title={game.name}
                visible={this.props.visible}
                onCancel={this.props.handleCancel}
                onOk={this.handleReviewClick}
                okText="Write Review"
                cancelText="Close"
            >
                <div>
                    <Avatar size={128} src={game.photoURL}></Avatar>
                    <h2>{game.developer}</h2>
                    <h3>{game.publisher}</h3>
                    <h4>{game.year}</h4>
                    <h5>{game.genre}</h5>
                </div>
                <div>
                    <Rate allowHalf onChange={this.onStarChange}/>
                    <TextArea rows={4} onChange={this.onReviewChange}/>
                </div>
                <div>
                    {this.state.reviews.map((review, index) => (
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
                            <p>
                                {review.body}
                            </p>
                            </div>
                            }
                            datetime={<span>{review.createdAt.toLocaleDateString("en-US")}</span>}
                        />
                    ))}
                </div>
            </Modal>
        );
    }
}

export default GameModal;
