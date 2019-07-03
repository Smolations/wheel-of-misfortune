import PropTypes from 'prop-types';
import React from 'react';

import {
  Button,
  Card,
  Grid,
} from 'semantic-ui-react';

import './Wheel.css';


export default class Wheel extends React.Component {
  state = {
    prize: 'Spin!',
    isSpinning: false,
  }

  spinWheel = () => {
    const { onSpinEnd, onSpinStart, prizes } = this.props;
    const maxSelections = 20;
    let selectionCount = 0;

    this.setState({ isSpinning: true });

    onSpinStart();

    const intervalId = setInterval(() => {
      const randomPrizeIndex = Math.floor(Math.random() * Math.floor(prizes.length));
      const prize = prizes[randomPrizeIndex];
      const prizeString = (prize === 0) ? 'Bankrupt' : `$${prize}`; // update for free play/lose turn

      // setting state using a function to ensure the rendering of
      // each prize for each interval
      this.setState((state, props) => {
        return { ...state, prize: prizeString };
      });

      selectionCount++;

      if (selectionCount >= maxSelections) {
        clearInterval(intervalId);
        onSpinEnd(prize);
        this.setState({ isSpinning: false });
      }
    }, 100);
  }

  render() {
    // centered, 4 columns is a bit of a hack to get
    // the wheel centered
    return (
      <div className="Wheel">
        <Grid
          columns="4"
          textAlign="center"
          verticalAlign="middle"
          centered
        >
          <Grid.Row>
            <Grid.Column>
              <Card>
                <Card.Content textAlign="center">
                  <h1>{this.state.prize}</h1>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign="center" verticalAlign="middle">
              <Button disabled={this.state.isSpinning} onClick={this.spinWheel}>
                Take your spin
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}


Wheel.propTypes = {
  onSpinEnd: PropTypes.func,
  onSpinStart: PropTypes.func,
  prizes: PropTypes.arrayOf(PropTypes.number).isRequired,
};

Wheel.defaultProps = {
  onSpinEnd: () => {},
  onSpinStart: () => {},
};
