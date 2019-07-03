import PropTypes from 'prop-types';
import React from 'react';

import { Grid } from 'semantic-ui-react';

import './Board.css';


export default class Board extends React.Component {
  renderRow = (row, rowIndex) => {
    const rowKey = row.reduce((accum, cell) => `${accum}${cell.char}`, '');
    let className = 'inner';

    const cells = row.map((cell, cellIndex) => {
      const classes = ['Board-cell'];

      cell.empty && classes.push('empty');
      cell.visible && classes.push('visible');

      return (
        <Grid.Column
          className={classes.join(' ')}
          textAlign="center"
          verticalAlign="middle"
          key={cellIndex}
        >
          <h1>{cell.empty ? '.' : cell.char}</h1>
        </Grid.Column>
      );
    });

    if (rowIndex === 0) {
      className = 'outer-top';
    } else if (rowIndex === 3) {
      className = 'outer-bottom';
    }

    return (
      <Grid.Row className={className} centered columns={14} key={rowKey}>
        {cells}
      </Grid.Row>
    );
  }


  render() {
    const { rowData } = this.props;

    // set columns to 2 to get top/bottom rows to center (paired with `Grid.Row` attrs)
    return (
      <div className="Board">
        <Grid columns={2}>
          {rowData.map(this.renderRow)}
        </Grid>
      </div>
    );
  }
}


Board.propTypes = {
  rowData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    char: PropTypes.string,
    empty: PropTypes.bool,
    visible: PropTypes.bool,
  }))),
};

Board.defaultProps = {
  rowData: [],
};
