import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Game from './pages/Game';
import Menu from './pages/Menu';
import CustomGame from './pages/CustomGame';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Menu} />
        <Route exact path="/play" component={Game} />
        <Route exact path="/custom" component={CustomGame} />
      </Switch>
    </Router>
  );
}

export default Routes;