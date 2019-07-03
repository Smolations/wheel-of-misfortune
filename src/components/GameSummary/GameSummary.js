import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Container,
  Header,
  Icon,
  Label,
} from 'semantic-ui-react';

import './GameSummary.css';


export default class GameSummary extends React.Component {
  render() {
    const { answer, onPlayAgain, player, score } = this.props;

    return (
      <Container className="GameSummary">
        <Header
          as="h1"
          content={`Congratulations ${player.firstName}, you won!`}
        />
        <Header as="h2">
          <Label circular size="massive" color="green">${score}</Label>
        </Header>

        <h3>&ldquo;{answer.toUpperCase()}&rdquo;</h3>

        <Container textAlign="center">
          <Button primary size="huge" onClick={() => onPlayAgain()}>
            Play again
            <Icon name="right arrow" />
          </Button>
        </Container>
      </Container>
    );
  }
}


GameSummary.propTypes = {
  answer: PropTypes.string.isRequired,
  onPlayAgain: PropTypes.func,
  player: PropTypes.object.isRequired,
  score: PropTypes.number.isRequired,
};

GameSummary.defaultProps = {
  onPlayAgain: () => {},
};
