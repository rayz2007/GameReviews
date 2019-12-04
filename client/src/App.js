import React from 'react';
import { Layout, Button, Row } from 'antd'
import LoginModal from './LoginModal.js'
import GameModal from './GameModal.js'
import GameContainer from './GameContainer.js'
import 'whatwg-fetch'
import './App.css';
import "antd/dist/antd.css";

const { Header, Content } = Layout;
const gamesUrl = 'https://api.info441-ray.me/v1/'

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameInfo: [
                {
                    id: 0,
                    name: "Overwatch",
                    genre: "First-person shooter",
                    publisher: "Blizzard Entertainment",
                    developer: "Blizzard Entertainment",
                    year: 2016,
                    photoURL: "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Overwatch_cover_art.jpg/220px-Overwatch_cover_art.jpg",
                    reviews: []
                },
                {
                    id: 1,
                    name: "The Elder Scrolls V: Skyrim",
                    genre: "Action role-playing",
                    publisher: "Bethesda Softworks",
                    developer: "Bethesda Game Studios",
                    year: 2011,
                    photoURL: "https://upload.wikimedia.org/wikipedia/en/1/15/The_Elder_Scrolls_V_Skyrim_cover.png",
                    reviews: []
                },
                {
                    id: 2,
                    name: "Overwatch",
                    genre: "First-person shooter",
                    publisher: "Blizzard Entertainment",
                    developer: "Blizzard Entertainment",
                    year: 2016,
                    photoURL: "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Overwatch_cover_art.jpg/220px-Overwatch_cover_art.jpg",
                    reviews: []
                },
                {
                    id: 3,
                    name: "The Elder Scrolls V: Skyrim",
                    genre: "Action role-playing",
                    publisher: "Bethesda Softworks",
                    developer: "Bethesda Game Studios",
                    year: 2011,
                    photoURL: "https://upload.wikimedia.org/wikipedia/en/1/15/The_Elder_Scrolls_V_Skyrim_cover.png",
                    reviews: []
                }
            ],
            user: {
                userName: "test"
            },
            loginVisible: false,
            gameVisible: false,
            selectedGame: {
                id: 0,
                name: "Overwatch",
                genre: "First-person shooter",
                publisher: "Blizzard Entertainment",
                developer: "Blizzard Entertainment",
                year: 2016,
                imgURL: "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Overwatch_cover_art.jpg/220px-Overwatch_cover_art.jpg",
                reviews: []
            },
            newUser: {}
        }
    }

    // componentDidMount() {
    //   fetchGameInfo();
    // }
    fetchUser = () => { }

    // when back-end service is ready this function will fetch all the games.
    // fetchGameInfo = async () => { 
    //   window.fetch(gamesUrl + 'games')
    //     .then(response => {
    //       return response.json();
    //     }).then(json => {
    //       this.setState({gameInfo: json});
    //     });
    // }

    handleLoginClick = () => {
        this.setState({
            loginVisible: true,
            form: "Login"
        });
    }

    handleLogoutClick = () => {
        this.setState({
            user: null
        });
    }

    handleSignupClick = () => {
        this.setState({
            loginVisible: true,
            form: "Sign Up"
        });
    }

    handleLoginOk = e => {
        console.log(this.state.newUser);
        if(this.state.form === "Login") {
            this.setState({
                loginVisible: false
            });
        } else {
            
            this.setState({
                loginVisible: false
            });
        }
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

    handleCardClick = (game) => {
        this.setState({
            gameVisible: true,
            selectedGame: game
        });
    }

    render() {
        return (
            <Layout className="main">
                <Header className="header">
                    <span className="pageTitle">Title</span>
                    <div className={this.state.user ? "userButtons hidden" : "userButtons"}>
                        <Button onClick={this.handleLoginClick}>Log In</Button>
                        <Button onClick={this.handleSignupClick}>Sign Up</Button>
                    </div>
                    <div className={this.state.user && this.state.user.userName ? "currentUser" : "currentUser hidden"}>
                        <span id="userDisplay">{this.state.user && this.state.user.userName ? "Logged in as " + this.state.user.userName : ""}</span>
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
                    >
                    </GameModal>
                    <GameContainer
                        gameInfo={this.state.gameInfo}
                        user={this.state.user}
                        handleCardClick={this.handleCardClick}
                    >
                    </GameContainer>
                </Content>
            </Layout>
        );
    }
}

export default App;
