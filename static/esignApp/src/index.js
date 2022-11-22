import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


import '@atlaskit/css-reset';
import {Helmet} from "react-helmet";


export const run = ReactDOM.render(
    <React.StrictMode>
        
          <App />
        
          
      
    </React.StrictMode>,
    document.getElementById('root')
);
