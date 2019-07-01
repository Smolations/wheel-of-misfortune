import PropTypes from 'prop-types';
import React from 'react';

import {
  Card,
  Container,
  Grid,
} from 'semantic-ui-react';

import './Board.css';


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


export default class Board extends React.Component {
  boardColumnsAsGutters = 1;

  columns = 16;

  state = {
    rows: [],
  }

  componentDidMount() {
    const { answer } = this.props;
    const wordsAsRows = getWordsAsRows(answer, this.columns, this.boardColumnsAsGutters);
    const rowData = wordsAsRows.map(rowWords => getLineFromWords(rowWords, this.columns)).map(getRowDataFromLine);
    console.log('[Board.componentDidMount] rowData: %o', rowData);

    this.setState({ rows: rowData });
  }

  renderRow = (row) => {
    const rowKey = row.reduce((accum, cell) => `${accum}${cell.char}`, ''); // obfuscate better?
    const cells = row.map((cell, ndx) => {
      const classes = ['Board-cell'];

      cell.empty && classes.push('empty');
      cell.visible && classes.push('letter');

      return (
        <Grid.Column className={classes.join(' ')} key={ndx}>
          <h1>{cell.empty ? '.' : cell.char}</h1>
        </Grid.Column>
      );
    });

    return (
      <Grid.Row key={rowKey}>
        {cells}
      </Grid.Row>
    );
  }


  render() {
    const { answer } = this.props;
    // const wordsAsRows = getWordsAsRows(answer, this.columns, this.boardColumnsAsGutters);
    // console.log('[Board.render] wordsAsRows: %o', wordsAsRows);

    return (
      <div className="Board">
        <Grid columns={this.columns} textAlign="center" verticalAlign="middle" divided={true}>
          {this.state.rows.map(this.renderRow)}
        </Grid>
      </div>
    );
  }
}


Board.propTypes = {
  answer: PropTypes.string,
};
