import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Container,
  Header,
  Icon,
} from 'semantic-ui-react';

import './GameSummary.css';


export default class GameSummary extends React.Component {
  render() {
    const { player, score } = this.props;

    return (
      <Container text>
        <Header
          as="h1"
          content={`Congratulations ${player.firstName}, you won!`}
          style={{
            fontSize: '4em',
            fontWeight: 'normal',
            marginBottom: 0,
            marginTop: '3em',
          }}
        />
        <Header
          as="h2"
          content={`You won $${score}`}
          style={{
            fontSize: '1.7em',
            fontWeight: 'normal',
            marginTop: '1.5em',
          }}
        />
        <Button primary size="huge">
          Play again
          <Icon name="right arrow" />
        </Button>
      </Container>
    );
  }
}


GameSummary.propTypes = {
  player: PropTypes.object,
  score: PropTypes.number,
};
