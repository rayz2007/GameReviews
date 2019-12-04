import React from 'react';
import { Layout, Button, Row } from 'antd'
import LoginModal from './LoginModal.js'
import GameModal from './GameModal.js'
import GameContainer from './GameContainer.js'
import 'whatwg-fetch'
import './App.css';
import "antd/dist/antd.css";

const { Header, Content } = Layout;
const baseUrl = 'https://api.gamereviewz.me/v1/';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameInfo: [],
            userToken: null,
            loginVisible: false,
            gameVisible: false,
            selectedGame: {},
            newUser: {},
            reviews: [],
            newReview: {}
        }
    }

    componentDidMount() {
        const token = window.localStorage.getItem("token");
        if(token && token.length > 0) {
            this.setState({userToken: token});
        }
        this.fetchGameInfo();
    }

    //when back-end service is ready this function will fetch all the games.
    fetchGameInfo = async () => { 
        window.fetch(baseUrl + 'games')
            .then(response => {
                //console.log(response);
                return response.json();
            }).then(json => {
                this.setState({gameInfo: json});
            });
    }

    handleLoginClick = () => {
        this.setState({
            loginVisible: true,
            form: "Login"
        });
    }

    handleLogoutClick = () => {
        const response = window.fetch(baseUrl + 'sessions/mine', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', "Authorization": this.state.userToken},
            body: JSON.stringify(this.state.newUser),
        }).then(response => {
            this.setState({
                userToken: null
            });
            window.localStorage.setItem('token', '');
            return(response);
        }).catch(err => {
            console.log(err);
        })
    }

    handleSignupClick = () => {
        this.setState({
            loginVisible: true,
            form: "Sign Up"
        });
    }

    handleLoginOk = e => {
        if(this.state.form === "Login") {
            const response = window.fetch(baseUrl + 'sessions', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.state.newUser),
            }).then(response => {
                this.setState({userToken: response.headers.get("Authorization")});
                window.localStorage.setItem('token', response.headers.get("Authorization"));
                return(response.json());
            }).then(json => {
                this.setState({
                    userInfo: json
                });
            }).catch(err => {
                console.log(err);
            })
        } else {
            console.log(JSON.stringify(this.state.newUser));
            const response = window.fetch(baseUrl + 'users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                //body: JSON.stringify({'email': 'test@gmail.com', 'password': 'wefwef', 'passwordConf': 'wefwef', 'userName': 'testUser', 'firstName': 'testName', 'lastName': 'wer'})
                body: JSON.stringify(this.state.newUser)
            }).then(response => {
                this.setState({
                    userToken: response.headers.get("Authorization"),
                });
                window.localStorage.setItem('token', response.headers.get("Authorization"));
                return(response.json());
            }).then(json => {
                this.setState({
                    userInfo: json
                });
            })
            .catch(err => {
                console.log(err);
            })
        }
        this.setState({
            loginVisible: false
        });
    };

    handleUserInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        this.setState(prevState => ({
            newUser: {
                ...prevState.newUser,
                [id]: value
            }
        }));
    }

    handleCancel = e => {
        console.log(e);
        this.setState({
            loginVisible: false,
            gameVisible: false
        });
    };

    fetchReviews = () => {
        const game = this.state.selectedGame;
        const response = window.fetch(baseUrl + '/games/reviews/' + game.id)
            .then(response => {
                console.log(response);
                return(response.json());
            }).then(json => {
                console.log(json);
                this.setState({reviews: json});
            }).catch(err => {
                console.log(err);
            });
    }

    handleCardClick = (game) => {
        this.setState({
            gameVisible: true,
            selectedGame: game
        }, () => {
            this.fetchReviews();
        });
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
        const id = e.target.id;
        this.setState(prevState => ({
            newReview: {
                ...prevState.newReview,
                [id]: value
            }
        }));
    }

    handleReviewClick = () => {
        let {rating, platform, body} = this.state.newReview;
        let reviews = this.state.reviews;
        const gameID = this.state.selectedGame.id;
        let newReview = {
            gameID,
            rating,
            platform,
            body
        }
        const response = window.fetch(baseUrl + 'games/reviews', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', "Authorization": this.state.userToken},
            body: JSON.stringify(newReview),
        }).then(response => {
            console.log(response);
            return(response.json());
        }).then(json => {
            reviews.push(json);
            this.setState({reviews});
        }).catch(err => {
            console.log(err);
        })
        this.setState({
            addGameVisible: false
        });
    }
    

    render() {
        return (
            <Layout className="main">
                <Header className="header">
                    <span className="pageTitle">Title</span>
                    <div className={this.state.userToken ? "userButtons hidden" : "userButtons"}>
                        <Button onClick={this.handleLoginClick}>Log In</Button>
                        <Button onClick={this.handleSignupClick}>Sign Up</Button>
                    </div>
                    <div className={this.state.userToken ? "currentUser" : "currentUser hidden"}>
                        <span>Logged in as {this.state.userInfo && this.state.userInfo.userName}</span>
                        <Button onClick={this.handleLogoutClick}>Log Out</Button>
                    </div>
                </Header>
                <Content className="content">
                    <LoginModal
                        visible={this.state.loginVisible || this.state.signupVisible}
                        handleOk={this.handleLoginOk}
                        handleCancel={this.handleCancel}
                        handleUserInput={this.handleUserInput}
                        form={this.state.form}
                    >
                    </LoginModal>
                    <GameModal
                        visible={this.state.gameVisible}
                        handleCancel={this.handleCancel}
                        game={this.state.selectedGame}
                        userToken={this.state.userToken}
                        reviews={this.state.reviews}
                        onReviewChange={this.onReviewChange}
                        onStarChange={this.onStarChange}
                        handleReviewClick={this.handleReviewClick}
                    >
                    </GameModal>
                    <GameContainer
                        gameInfo={this.state.gameInfo}
                        user={this.state.user}
                        handleCardClick={this.handleCardClick}
                        userToken={this.state.userToken}
                        fetchGames={this.fetchGameInfo}
                    >
                    </GameContainer>
                </Content>
            </Layout>
        );
    }
}

export default App;
