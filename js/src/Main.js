import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Watch from "./Watch";
import Stream from "./Stream";
import Profile from "./Profile";
import PageGuard from "./PageGuard";
import Purchase from "./Purchase";
import Friends from "./Friends";

// Global States
const Main = () => {

  return (
    <div className="container">



      <Router>
        <Switch>
          <Route path='/' exact>
            <Login/>
          </Route>
          <Route path='/register' exact>
            <Register/>
          </Route>

          <Route path='/home' exact>
            <PageGuard component={Home}/>
          </Route>
          <Route path='/watch' exact>
            <PageGuard component={Watch}/>
          </Route>
          <Route path='/:type/view/:title' exact>
            <PageGuard component={Stream}/>
          </Route>

          <Route path='/profile/:userid' exact>
            <PageGuard component={Profile}/>
          </Route>

          <Route path='/purchase' exact>
            <PageGuard component={Purchase}/>
          </Route>
          <Route path='/friends' exact>
            <PageGuard component={Friends}/>
          </Route>

        </Switch>
      </Router>

    </div>
  );
}

ReactDOM.render(
  <Main />,
  document.getElementById('app')
);
