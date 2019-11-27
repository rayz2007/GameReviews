import React from 'react';
import { Layout, Button, Row } from 'antd'
import GameCard from './GameCard.js'
import LoginModal from './LoginModal.js'
import './App.css';
import "antd/dist/antd.css";

const { Header, Sider, Content } = Layout;

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
      signupVisible: false
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
      signupVisible: false
    });
  };

  renderCards = () => {
    let cardRows = [];
    let row = [];
    for(const game of this.state.gameInfo) {
      if(row.length < 3) {
        row.push(<GameCard key={game.id} gameInfo={game}></GameCard>);
      } else {
        cardRows.push(<Row gutter={[16, 16]} type="flex">{row}</Row>);
        row = [];
        row.push(<GameCard key={game.id} gameInfo={game}></GameCard>);
      }
    }
    cardRows.push(<Row gutter={[16, 16]} type="flex">{row}</Row>);
    return cardRows;
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
        <Layout>
          <Sider>

          </Sider>
          <Content>
            <LoginModal 
              visible={this.state.loginVisible || this.state.signupVisible} 
              handleOk={this.handleOk} 
              handleCancel={this.handleCancel} 
              form={this.state.loginVisible ? "Login" : "Sign Up"}
            >
            </LoginModal>
            <div className="cardContainer">
              {this.renderCards()}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
