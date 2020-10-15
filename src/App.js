import React from 'react';
import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ImageConvertor from './components/ImageConvertor'
import Page from './components/Page'
function App() {
  return (
    <div className="App">
      <Router>
      <Switch>
        <Route exact path="/">
          <ImageConvertor />
        </Route>
        <Route path="/page">
          <Page />
        </Route>
      </Switch>
      </Router>
       <footer className="page-footer font-small blue pt-4">
        Developed By:<strong> Garima Sah</strong>
      </footer>
    </div>
  );
}

export default App;
