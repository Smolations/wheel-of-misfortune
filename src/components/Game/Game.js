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
      'mythological',
      ' hero achilles'
    ],
    [
      'shaggy &  ',
      'scooby-doo'
    ],
    [
      'i\'ve got a ',
      'good feeling',
      'about this  ',
    ],
  ];

  ephemeralAnswers = [];

  prizes = [
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
  ];

  vowelCost = 250;



  componentDidMount() {
    this.setUpNewGame();
  }


  getAnswerAsString = () => this.state.answer.map(line => line.trim()).join(' ')


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
      isSolved: this.isSolved(),
      lettersDisabled: true,
      rowData: newRowData,
      score: newScore,
      solveDisabled: false,
    });
  }

  handleSolve = (guess) => {
    const answer = this.getAnswerAsString();

    if (answer === guess.trim().toLowerCase()) {
      this.setState({ isSolved: true });
    } else {
      this.setState({ showWrongSolutionModal: true, solveDisabled: true });
    }
  }

  handleSpinEnd = (prize) => {
    const isBankrupted = prize === 0;
    let newScore = this.state.score;

    if (isBankrupted) {
      newScore = 0;
    }

    this.setState({
      lettersDisabled: isBankrupted,
      prize,
      score: newScore,
    });
  }

  handleSpinStart = () => {
    this.setState({ lettersDisabled: true, solveDisabled: true });
  }

  handleConsonantGuess = (guess) => {
    this.handleGuess(guess);
  }

  handleVowelGuess = (guess) => {
    this.handleGuess(guess, this.vowelCost);
  }

  handleWrongSolutionModalClose = (evt, data) => {
    this.setState({ showWrongSolutionModal: false });
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

  setUpNewGame = () => {
    // we need to keep the original answers intact so they
    // can be replenished in case they all get used up
    if (!this.ephemeralAnswers.length) {
      this.ephemeralAnswers = this.answers.slice(0);
    }

    const randomAnswerIndex = Math.floor(Math.random() * Math.floor(this.ephemeralAnswers.length));
    const [answer] = this.ephemeralAnswers.splice(randomAnswerIndex, 1);

    this.setState({
      answer,
      guesses: [],
      isSolved: false,
      lettersDisabled: true,
      prize: null,
      rowData: getRowDataFromAnswer(answer),
      score: 0,
      solveDisabled: true,
    });
  }


  render() {
    const {
      lettersDisabled,
      isSolved,
      rowData,
      score,
      showWrongSolutionModal,
      solveDisabled,
    } = this.state;

    return isSolved
      ? (
          <GameSummary
            answer={this.getAnswerAsString()}
            player={this.props.player}
            score={score}
            onPlayAgain={this.setUpNewGame}
          />
        )
      : (
          <Container>
            <Board rowData={rowData} />
            <Wheel onSpinEnd={this.handleSpinEnd} onSpinStart={this.handleSpinStart} prizes={this.prizes} />
            <Guess
              canBuyVowel={score >= this.vowelCost}
              lettersDisabled={lettersDisabled}
              solveDisabled={solveDisabled}
              vowelCost={this.vowelCost}
              onConsonant={this.handleConsonantGuess}
              onVowel={this.handleVowelGuess}
              onSolve={this.handleSolve}
            />

            <Modal size="mini" open={showWrongSolutionModal} onClose={this.handleWrongSolutionModalClose}>
              <Modal.Header>Oh Noes!</Modal.Header>
              <Modal.Content>
                <p>You were <em>so</em> wrong...</p>
              </Modal.Content>
              <Modal.Actions>
                <Button positive content="Dang it! Okay..." onClick={this.handleWrongSolutionModalClose} />
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
