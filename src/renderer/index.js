import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './scss/index.scss';
import App from './components/App.jsx';
import initStore from './store';

ReactDOM.render(
  <Provider store={initStore()}>
    <App />
  </Provider>,
  document.getElementById('container')
);
