import { AppComponent } from 'App';
import 'i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import HttpsRedirect from 'react-https-redirect';

import pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import './index.css';
import * as serviceWorker from './serviceWorker';

const ResumeBuilder = (
  <HttpsRedirect>
    <AppComponent />
  </HttpsRedirect>
);

ReactDOM.render(ResumeBuilder, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
