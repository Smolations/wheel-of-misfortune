import PropTypes from 'prop-types';
import React from 'react';
// import { Link, Route } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
  Header,
} from 'semantic-ui-react';

import './CreatePlayer.css';


export default class CreatePlayer extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    isAgreed: false,
  }


  handleCheckboxChange = () => {
    this.setState({ isAgreed: !this.state.isAgreed });
  }

  handleInputChange = (evt) => {console.log('setting [%o] = %o', evt.target.name, evt.target.value)
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit = (evt) => {
    const { onSubmit } = this.props;

    evt.preventDefault();

    onSubmit({ ...this.state });
  }

  isFormDisabled = () => {
    const { firstName, lastName, isAgreed } = this.state;
    return !isAgreed || !firstName.length || !lastName.length;
  }


  render() {
    return (
      <Container className="CreatePlayer" text={true}>
        <Header as="h1">
          Create Player
        </Header>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field
            control={Form.Input}
            label="First name"
            name="firstName"
            placeholder="First name"
            onChange={this.handleInputChange}
          />
          <Form.Field
            control={Form.Input}
            label="Last name"
            name="lastName"
            placeholder="Last name"
            onChange={this.handleInputChange}
          />
          <Form.Checkbox
            label="I agree that no actual misfortune will befall me when playing this game."
            name="isAgreed"
            onChange={this.handleCheckboxChange}
          />

          <Button type="submit" disabled={this.isFormDisabled()}>Submit</Button>
        </Form>
      </Container>
    );
  }
}


CreatePlayer.propTypes = {
  onSubmit: PropTypes.func,
};
