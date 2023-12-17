import React from 'react';
import ReactDOM from 'react-dom/client';
import './Assets/js/utility';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import './Assets/css/icons.min.css';
import 'toastr/build/toastr.min.css';
import './Config';
import { Provider } from 'react-redux';
import store from './Components/Redux/Store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
