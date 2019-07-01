import PropTypes from 'prop-types';
import React from 'react';

import {
  Card,
  Container,
  Sidebar,
} from 'semantic-ui-react';

import Board from './Board';
import Guess from './Guess';
import Wheel from './Wheel';


const answers = [
  'douche bagged lunch dude',
];

export default class Game extends React.Component {
  state = {
    answer: '',
    score: 0,
  }

  constructor(props) {
    super(props);

    const randomAnswerIndex = Math.floor(Math.random() * Math.floor(answers.length));

    this.state.answer = answers[randomAnswerIndex];
  }

  handleGuess = (guess) => {}

  handleWheelSelect = (selection) => {}


  render() {
    const { firstName, lastName } = this.props.player;

    return (
      <React.Fragment>
        <Sidebar as={Container} direction="right" visible={true}>
          <Card>
            <Card.Content header="Scoreboard" />
            <Card.Content>
              <h5>Player Name:</h5>
              <p>{`${firstName} ${lastName}`}</p>
            </Card.Content>
            <Card.Content>
              <h5>Score:</h5>
              <p>${this.state.score}</p>
            </Card.Content>
          </Card>
        </Sidebar>

        <Container>
          <Board answer={this.state.answer} />
          <Wheel onSelect={this.handleWheelSelect} />
          <Guess onGuess={this.handleGuess} />
        </Container>
      </React.Fragment>
    );
  }
}


Game.propTypes = {
  player: PropTypes.object.isRequired,
};
