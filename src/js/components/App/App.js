import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import {
  Container,
  Image,
  Menu,
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
  }


  handlePlayerCreate = (player) => {
    console.log('Player created! %o', player);
    this.setState({ player });
    this.props.history.replace('/play');
  };


  render() {console.log('[App.render]')
    return (
      <div className="App">
        <Menu attached="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              <Image size="tiny" src={logo} className="App-logo" />
              Wheel of Misfortune!
            </Menu.Item>
            <Menu.Item as="a">Start Over</Menu.Item>
          </Container>
        </Menu>

        <Route path="/" exact component={Splash} />
        <Route path="/create-player" component={() => <CreatePlayer onSubmit={this.handlePlayerCreate} />} />
        <Route path="/play" component={() => <Game player={this.state.player} />} />
      </div>
    );
  }
}


export default withRouter(App);
