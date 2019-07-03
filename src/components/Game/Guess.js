import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Container,
  Form,
  Grid,
  Input, Modal
} from 'semantic-ui-react';

import './Guess.css';


export default class Guess extends React.Component {
  state = {
    guesses: [],
    puzzleSolution: '',
  };


  constructor(props) {
    super(props);

    const letters = [...'abcdefghijklmnopqrstuvwxyz'];

    this.vowels = [...'aeiou'];
    this.letterRows = [
      letters.slice(0, 13),
      letters.slice(13),
    ];
  }


  handleGuess = (guess) => {
    const isVowel = this.vowels.includes(guess);

    if (isVowel) {
      this.props.onVowel(guess);
    } else {
      this.props.onConsonant(guess);
    }

    this.setState({ guesses: this.state.guesses.concat([guess]) });
  }

  handleSolutionChange = (evt) => {
    this.setState({ puzzleSolution: evt.target.value });
  }

  handleSolve = (evt) => {
    this.props.onSolve(this.state.puzzleSolution);
    this.setState({ puzzleSolution: '' });
    evt.preventDefault();
  }


  renderRow = (row) => {
    const { guesses } = this.state;
    const { disabled } = this.props;
    const vowels = [...'aeiou'];
    const rowKey = row.reduce((accum, cell) => `${accum}${cell}`, '');

    const cells = row.map((cell, ndx) => {
      const isDisabled = guesses.includes(cell) || disabled;
      const buyVowelModalActions = [
        { key: 'nay', negative: true, content: 'Nope, nevermind', name: 'notBuying' },
        { key: 'yay', positive: true, content: `Buy for $${this.props.vowelCost}`, name: 'buyVowel' },
      ];

      const cellElement = vowels.includes(cell)
        ? (
            <Modal
              trigger={<Button disabled={isDisabled}>{cell}</Button>}
              size="tiny"
              header="Time to pay up!"
              vowel={cell}
              content={(
                <Modal.Content>
                  <p>Would you like to buy the vowel <strong>{cell.toUpperCase()}</strong>?</p>
                </Modal.Content>
              )}
              actions={buyVowelModalActions}
              onActionClick={(evt, data) => evt.target.name === 'buyVowel' && this.handleGuess(data.vowel)}
            />
          )
        : (
            <Button disabled={isDisabled} onClick={() => this.handleGuess(cell)}>
              {cell}
            </Button>
          );

      return (
        <Grid.Column key={ndx}>
          {cellElement}
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
    // 26 letters will distribute evenly over two rows
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
            <Form.Field disabled={this.props.disabled}>
              <label>Would you like to solve the puzzle?</label>
              <Input
                name="puzzleSolution"
                placeholder="Take a guess..."
                value={this.state.puzzleSolution}
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
  onConsonant: PropTypes.func,
  onVowel: PropTypes.func,
  onSolve: PropTypes.func,
  vowelCost: PropTypes.number,
};

Guess.defaultProps = {
  onConsonant: () => {},
  onVowel: () => {},
  onSolve: () => {},
  vowelCost: 0,
};
