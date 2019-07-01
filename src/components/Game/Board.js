import PropTypes from 'prop-types';
import React from 'react';

import {
  Card,
  Container,
  Grid,
} from 'semantic-ui-react';

import './Board.css';


export default class Board extends React.Component {
  renderRow = (row) => {
    const rowKey = row.reduce((accum, cell) => `${accum}${cell.char}`, '');
    const cells = row.map((cell, ndx) => {
      const classes = ['Board-cell'];

      cell.empty && classes.push('empty');
      cell.visible && classes.push('visible');

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
    const { rowData } = this.props;
    const columns = rowData[0] ? rowData[0].length : 16;

    return (
      <div className="Board">
        <Grid
          columns={columns}
          textAlign="center"
          verticalAlign="middle"
          padded={true}
        >
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
