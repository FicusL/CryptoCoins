import 'reflect-metadata';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';

import './modules/Shared/style/index.scss';

import RootRouting from './modules/RootRouting';
import ScrollToTop from './modules/Shared/components/ScrollToTop/ScrollToTop';

ReactDOM.render(
  <div>
    <BrowserRouter>
      <ScrollToTop>
        <RootRouting />
      </ScrollToTop>
    </BrowserRouter>
  </div>,
  document.getElementById('root') as HTMLElement,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
