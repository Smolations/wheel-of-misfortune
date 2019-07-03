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

    // yes, characters other than letters _can_ show up in answers!
    const characters = [...'abcdefghijklmnopqrstuvwxyz'];

    this.vowels = [...'aeiou'];
    this.characterRows = [
      characters.slice(0, 13),
      characters.slice(13),
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


  renderVowel = (vowel) => {
    const { canBuyVowel, lettersDisabled, vowelCost } = this.props;
    const isDisabled = this.state.guesses.includes(vowel) || lettersDisabled;

    const buyVowelModalActions = [
      { key: 'nay', negative: true, content: 'Nope, nevermind', name: 'notBuying' },
      { key: 'yay', positive: true, content: `Buy for $${vowelCost}`, name: 'buyVowel' },
    ];

    return canBuyVowel
      ? (
          <Modal
            trigger={<Button disabled={isDisabled}>{vowel}</Button>}
            size="tiny"
            header="Time to pay up!"
            content={(
              <Modal.Content>
                <p>Would you like to buy the vowel <strong>{vowel.toUpperCase()}</strong>?</p>
              </Modal.Content>
            )}
            actions={buyVowelModalActions}
            onActionClick={(evt) => evt.target.name === 'buyVowel' && this.handleGuess(vowel)}
          />
        )
      : (
          <Modal
            trigger={<Button disabled={isDisabled}>{vowel}</Button>}
            size="tiny"
            header="Well this is awkward..."
            content={`It seems the letter ${vowel.toUpperCase()} is out of your price range.`}
            actions={['Fine!']}
          />
        );
  }

  renderRow = (row) => {
    const { guesses } = this.state;
    const { lettersDisabled } = this.props;
    const vowels = [...'aeiou'];
    const rowKey = row.reduce((accum, cell) => `${accum}${cell}`, '');

    const cells = row.map((cell, ndx) => {
      const isDisabled = guesses.includes(cell) || lettersDisabled;

      const cellElement = vowels.includes(cell)
        ? this.renderVowel(cell)
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
    // 26 letters will distribute evenly over two rows of 13
    return (
      <div className="Guess">
        <Grid
          columns={13}
          textAlign="center"
          verticalAlign="middle"
          padded={true}
        >
          {this.characterRows.map(this.renderRow)}
        </Grid>

        <Container text>
          <Form onSubmit={this.handleSolve}>
            <Form.Field disabled={this.props.solveDisabled}>
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
  canBuyVowel: PropTypes.bool,
  lettersDisabled: PropTypes.bool,
  solveDisabled: PropTypes.bool,
  vowelCost: PropTypes.number,
  onConsonant: PropTypes.func,
  onSolve: PropTypes.func,
  onVowel: PropTypes.func,
};

Guess.defaultProps = {
  vowelCost: 0,
  onConsonant: () => {},
  onSolve: () => {},
  onVowel: () => {},
};
