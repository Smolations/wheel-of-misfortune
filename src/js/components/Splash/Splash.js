import React from 'react';
import { Link } from 'react-router-dom';

import {
  Container,
} from 'semantic-ui-react';


export default function Splash(props) {
  return (
    <Container>
      <h2>
        Click below to begin
      </h2>
      <Link to="/create-player">Create my player</Link>
    </Container>
  );
}
