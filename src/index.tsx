import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './i18n';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

const ResumeBuilder = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.render(ResumeBuilder, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
