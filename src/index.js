import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";

import App from './js/components/App';

import './styles/index.css';


function AppRouter() {
  return (
    <Router>
      <Route path="/" component={App} />
    </Router>
  );
}


ReactDOM.render(<AppRouter />, document.getElementById('root'));
