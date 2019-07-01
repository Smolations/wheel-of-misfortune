import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Card,
  Container,
  Form,
  Grid,
  Input,
} from 'semantic-ui-react';

import './Guess.css';


export default class Guess extends React.Component {
  state = {
    guesses: [],
    puzzleSolution: null,
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

  handleSolutionChange = (evt) => {
    this.setState({ puzzleSolution: evt.target.value });
  }

  handleSolve = (evt) => {
    this.props.onSolve(this.state.puzzleSolution);
    evt.preventDefault();
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
    // 26 letters; will distribute evenly over two rows
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

        <Container text>
          <Form onSubmit={this.handleSolve}>
            <Form.Field>
              <label>Would you like to solve the puzzle?</label>
              <Input
                name="puzzleSolution"
                placeholder="Take a guess..."
                onChange={this.handleSolutionChange}
                action={<Button positive type="submit">Solve</Button>}
              />
            </Form.Field>
          </Form>
        </Container>
      </div>
    );
  }
}


Guess.propTypes = {
  disabled: PropTypes.bool,
  onGuess: PropTypes.func,
  onSolve: PropTypes.func,
};

Guess.defaultProps = {
  onGuess: () => {},
  onSolve: () => {},
};
