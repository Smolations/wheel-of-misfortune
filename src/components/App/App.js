import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import {
  Container,
  Image,
  Menu,
  Statistic,
} from 'semantic-ui-react';

import CreatePlayer from '../CreatePlayer';
import Game from '../Game';
import Splash from '../Splash';

import './App.css';

import logo from './logo.svg';


class App extends React.Component {
  state = {
    player: {
      firstName: 'John',
      lastName: 'Doe',
    },
    playerCreated: true, // spoofed during development
    score: 0,
  }


  handlePlayerCreate = (player) => {
    this.setState({ player, playerCreated: true });
    this.props.history.replace('/play');
  };

  handleScore = (score) => {
    this.setState({ score });
  }


  render() {
    const { player, playerCreated, score } = this.state;

    const scoreMenuItem = (
      <Menu.Item position="right">
        <Statistic horizontal inverted size="mini">
          <Statistic.Label>{player.firstName}&apos;s Score</Statistic.Label>
          <Statistic.Value>{`$${score}`}</Statistic.Value>
        </Statistic>
      </Menu.Item>
    );

    return (
      <div className="App">
        <Menu attached="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              <Image size="tiny" src={logo} className="App-logo" />
              Wheel of Misfortune!
            </Menu.Item>
            {playerCreated && scoreMenuItem}
          </Container>
        </Menu>

        <Route path="/" exact component={Splash} />
        <Route path="/create-player" render={() => <CreatePlayer onSubmit={this.handlePlayerCreate} />} />
        <Route path="/play" render={() => <Game onScore={this.handleScore} player={player} />} />
      </div>
    );
  }
}


export default withRouter(App);
