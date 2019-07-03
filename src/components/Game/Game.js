import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Container,
  Modal,
} from 'semantic-ui-react';

import Board from '../Board';
import GameSummary from '../GameSummary';
import Guess from '../Guess';
import Wheel from '../Wheel';

import getRowDataFromAnswer from '../../lib/getRowDataFromAnswer';


function getAnswer(answers) {
  const randomAnswerIndex = Math.floor(Math.random() * Math.floor(answers.length));
  return answers[randomAnswerIndex];
}


export default class Game extends React.Component {
  state = {
    answer: '',
    canGuess: false,
    guesses: [],
    isSolved: false,
    prize: null,
    rowData: [],
    score: 0,
    showBuyVowelModal: false,
    showWrongSolutionModal: false,
  }

  // create answers the way you'd like to see them on the board
  answers = [
    [
      'd-bagged',
      'lunch',
      'lady',
    ],
  ];

  numColumns = 16;

  numColumnsAsBoardGutter = 1;

  prizes = [
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
  ];

  vowelCost = 250;


  constructor(props) {
    super(props);

    const answer = getAnswer(this.answers);

    this.state.answer = answer;
    this.state.rowData = getRowDataFromAnswer(answer);
  }

  handleGuess = (guess, cost = 0) => {
    const { prize, rowData, score } = this.state;
    let matchCount = 0;
    let newRowData = rowData;
    let newScore = score - cost;

    newRowData = rowData.map((row) => {
      row.forEach((cell) => {
        if (guess === cell.char) {
          matchCount++;
          cell.visible = true;
        }
      });

      return row;
    });

    if (matchCount) {
      newScore += matchCount * prize;
    }

    this.props.onScore(newScore);

    this.setState({
      canGuess: false,
      isSolved: this.isSolved(),
      rowData: newRowData,
      score: newScore,
    });
  }

  handleModalClose = (evt, data) => {
    this.setState({ showWrongSolutionModal: false });
  }

  handlePlayAgain = () => {

  }

  handleSolve = (guess) => {
    if (this.state.answer === guess.trim().toLowerCase()) {
      this.setState({ isSolved: true });
    } else {
      this.setState({ showWrongSolutionModal: true });
    }
  }

  handleSpinEnd = (prize) => {
    const canGuess = prize !== 0;
    let newScore = this.state.score;

    if (!canGuess) {
      newScore = 0;
    }

    this.setState({ canGuess, prize, score: newScore });
  }

  handleConsonantGuess = (guess) => {
    this.handleGuess(guess);
  }

  handleVowelGuess = (guess) => {
    this.handleGuess(guess, this.vowelCost);
  }

  isSolved = () => {
    const { rowData } = this.state;
    let anyUnguessed = false;

    rowData.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.empty && !cell.visible) {
          anyUnguessed = true;
        }
      });
    });

    return !anyUnguessed;
  }


  render() {
    const {
      answer,
      canGuess,
      isSolved,
      rowData,
      score,
      showWrongSolutionModal,
    } = this.state;

    return isSolved
      ? (
          <GameSummary
            answer={answer}
            player={this.props.player}
            score={score}
            onPlayAgain={this.handlePlayAgain}
          />
        )
      : (
          <Container>
            <Board rowData={rowData} />
            <Wheel onSpinEnd={this.handleSpinEnd} prizes={this.prizes} />
            <Guess
              disabled={!canGuess}
              vowelCost={this.vowelCost}
              onConsonant={this.handleConsonantGuess}
              onVowel={this.handleVowelGuess}
              onSolve={this.handleSolve}
            />

            <Modal size="mini" open={showWrongSolutionModal} onClose={this.handleModalClose}>
              <Modal.Header>Oh Noes!</Modal.Header>
              <Modal.Content>
                <p>You were <em>so</em> wrong...</p>
              </Modal.Content>
              <Modal.Actions>
                <Button positive content="Dang it! Okay..." onClick={this.handleModalClose} />
              </Modal.Actions>
            </Modal>
          </Container>
        );
  }
}


Game.propTypes = {
  player: PropTypes.object.isRequired,
  onScore: PropTypes.func,
};

Game.defaultProps = {
  onScore: () => {},
};
