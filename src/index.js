import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

document.addEventListener('contextmenu', event => event.preventDefault());

ReactDOM.render(<App />, document.getElementById('root'));