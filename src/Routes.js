import React from 'react';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import Game from './pages/Game';
import Menu from './pages/Menu';
import CustomGame from './pages/CustomGame';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/react-minesweeper" component={Menu} />
        <Route exact path="/react-minesweeper/play" component={Game} />
        <Route exact path="/react-minesweeper/custom" component={CustomGame} />
        <Redirect to="/react-minesweeper" />
      </Switch>
    </Router>
  );
}

export default Routes;