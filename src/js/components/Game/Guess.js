import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Card,
  Container,
  Grid,
} from 'semantic-ui-react';

import './Guess.css';


export default class Guess extends React.Component {
  state = {
    guesses: [],
  };


  constructor(props) {
    super(props);

    const letters = [...'abcdefghijklmnopqrstuvwxyz'];

    this.letterRows = [
      letters.slice(0, 13),
      letters.slice(13),
    ];
  }

  handleGuess = (guess) => {
    this.setState({ guesses: this.state.guesses.concat([guess])});
    this.props.onGuess(guess);
  }

  renderRow = (row) => {
    const { guesses } = this.state;
    const { disabled } = this.props;

    const rowKey = row.reduce((accum, cell) => `${accum}${cell}`, '');
    const cells = row.map((cell, ndx) => {
      return (
        <Grid.Column key={ndx}>
          <Button
            disabled={guesses.includes(cell) || disabled}
            onClick={() => this.handleGuess(cell)}
          >
            {cell}
          </Button>
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
    // const columns = this.letterRows[0].length;
    const columns = 13;

    return (
      <div className="Guess">
        <Grid
          columns={columns}
          textAlign="center"
          verticalAlign="middle"
          padded={true}
        >
          {this.letterRows.map(this.renderRow)}
        </Grid>
      </div>
    );
  }
}


Guess.propTypes = {
  disabled: PropTypes.bool,
  onGuess: PropTypes.func,
};

Guess.defaultProps = {
  onGuess: () => {},
};
