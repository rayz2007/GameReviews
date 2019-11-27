import React from 'react';
import { Layout, Button } from 'antd'
import LoginModal from './LoginModal.js'
import GameModal from './GameModal.js'
import GameContainer from './GameContainer.js'
import './App.css';
import "antd/dist/antd.css";

const { Header, Content } = Layout;

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
          imgURL: "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Overwatch_cover_art.jpg/220px-Overwatch_cover_art.jpg",
          reviews: []
        },
        {
          id: 1,
          name: "The Elder Scrolls V: Skyrim",
          genre: "Action role-playing",
          publisher: "Bethesda Softworks",
          developer: "Bethesda Game Studios",
          year: 2011,
          imgURL: "https://upload.wikimedia.org/wikipedia/en/1/15/The_Elder_Scrolls_V_Skyrim_cover.png",
          reviews: []
        },
        {
          id: 2,
          name: "Overwatch",
          genre: "First-person shooter",
          publisher: "Blizzard Entertainment",
          developer: "Blizzard Entertainment",
          year: 2016,
          imgURL: "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Overwatch_cover_art.jpg/220px-Overwatch_cover_art.jpg",
          reviews: []
        },
        {
          id: 3,
          name: "The Elder Scrolls V: Skyrim",
          genre: "Action role-playing",
          publisher: "Bethesda Softworks",
          developer: "Bethesda Game Studios",
          year: 2011,
          imgURL: "https://upload.wikimedia.org/wikipedia/en/1/15/The_Elder_Scrolls_V_Skyrim_cover.png",
          reviews: []
        }
      ],
      user: null,
      loginVisible: false,
      signupVisible: false,
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
      }
    }
  }

  fetchUser = () => { }

  // when back-end service is ready this function will fetch all the games.
  fetchGameInfo = () => { }

  handleLoginClick = () => {
    this.setState({
      loginVisible: true,
    });
  }

  handleSignupClick = () => {
    this.setState({
      signupVisible: true
    });
  }

  handleOk = e => {
    console.log(e);
    this.setState({
      loginVisible: false,
      signupVisible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      loginVisible: false,
      signupVisible: false,
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
            <Button onClick={this.handleLoginClick}>Sign Up</Button>
          </div>
          <div className={this.state.user && this.state.user.userName ? "currentUser" : "currentUser hidden"}>
            {this.state.user && this.state.user.userName ? "Logged in as " + this.state.user.userName : ""}
          </div>
        </Header>
        <Content className="content">
          <LoginModal 
            visible={this.state.loginVisible || this.state.signupVisible} 
            handleOk={this.handleOk} 
            handleCancel={this.handleCancel} 
            form={this.state.loginVisible ? "Login" : "Sign Up"}
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
