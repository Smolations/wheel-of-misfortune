import PropTypes from 'prop-types';
import React from 'react';

import {
  Card,
  Container,
  Sidebar,
} from 'semantic-ui-react';

import Board from './Board';
import GameSummary from './GameSummary';
import Guess from './Guess';
import Wheel from './Wheel';


const answers = [
  'douche bagged lunch dude',
];

function getLineFromWords(words, maxLength) {//console.log('getLineFromWords(%o, %o)', words, maxLength)
  const trimmedLine = words.join(' ');
  const excess = maxLength - trimmedLine.length;
  let leftGutter = excess / 2;
  let rightGutter = leftGutter;

  if (excess % 2 !== 0) {
    // if gutters are unequal, let the right side have the bigger value
    leftGutter = (excess - 1) / 2;
    rightGutter = (excess + 1) / 2;
  }
  // console.log('trimmedLine: [%o]\nexcess: %o\nleftGutter: %o\nrightGutter: %o', trimmedLine, excess, leftGutter, rightGutter)

  return `${' '.repeat(leftGutter)}${trimmedLine}${' '.repeat(rightGutter)}`;
}

function wordsWithGutter(wordArr, gutterWidthh) {
  const gutter = ' '.repeat(gutterWidthh);
  return `${gutter}${wordArr.join(' ')}${gutter}`;
}

function getWordsAsRows(answer, columns, columnGutters) {
  const words = answer.split(' ');
  const wordsAsRows = [];

  let currentRowWords = [];
  let currentWord;

  while (words.length) {
    currentWord = words.shift();
    currentRowWords.push(currentWord);

    if (wordsWithGutter(currentRowWords, columnGutters).length > columns) {
      // new word won't fit in current row
      words.unshift(currentRowWords.pop());
      wordsAsRows.push(currentRowWords);
      currentRowWords = [];
    } else if (!words.length) {
      // this is the last word for processing
      wordsAsRows.push(currentRowWords);
    }
  }

  return wordsAsRows;
}

function getRowDataFromLine(rowLine) {
  const chars = [...rowLine];

  return chars.map((char) => {
    return {
      char,
      empty: char === ' ',
      visible: false,
    };
  });
}

export default class Game extends React.Component {
  state = {
    answer: '',
    guesses: [],
    rowData: [],
    score: 0,
    prize: null,
    isSolved: false,
    isSpinning: false,
    canGuess: false,
  }

  constructor(props) {
    super(props);

    const randomAnswerIndex = Math.floor(Math.random() * Math.floor(answers.length));
    const answer = answers[randomAnswerIndex];

    const columns = 16;
    const boardGutter = 1;
    const wordsAsRows = getWordsAsRows(answer, columns, boardGutter);
    const rowData = wordsAsRows.map(rowWords => getLineFromWords(rowWords, columns)).map(getRowDataFromLine);

    this.state.answer = answer;
    this.state.rowData = rowData;
  }

  handleGuess = (guess) => {
    const { prize, rowData, score } = this.state;
    let matchCount = 0;
    let newScore = score;

    const newRowData = rowData.map((row) => {
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

    this.setState({
      canGuess: false,
      isSolved: this.isSolved(),
      rowData: newRowData,
      score: newScore,
    });
  }

  handleSolve = (guess) => {
    console.log('[%o] ?== [%o]', this.answer, guess.trim().toLowerCase())
    if (this.state.answer === guess.trim().toLowerCase()) {
      this.setState({ isSolved: true });
    } // else tell the user how wrong they are!
  }

  handleSpinEnd = (prize) => {
    const canGuess = prize !== 0;
    let newScore = this.state.score;

    if (!canGuess) {
      newScore = 0;
    }

    this.setState({ canGuess, isSpinning: false, prize, score: newScore });
  }

  // this might now be deprecated; replaced with canGuess
  handleSpinStart = () => {
    this.setState({ isSpinning: true });
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
    const { firstName, lastName } = this.props.player;
    const { canGuess, isSolved, isSpinning, prize, rowData, score } = this.state;

    return isSolved
      ? (
          <GameSummary player={this.props.player} score={score} />
        )
      : (
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
                  <p>${score}</p>
                </Card.Content>
              </Card>
            </Sidebar>

            <Container>
              <Board rowData={rowData} />
              <Wheel onSpinStart={this.handleSpinStart} onSpinEnd={this.handleSpinEnd} />
              <Guess disabled={!canGuess} onGuess={this.handleGuess} onSolve={this.handleSolve} />
            </Container>
          </React.Fragment>
        );
  }
}


Game.propTypes = {
  player: PropTypes.object.isRequired,
};
