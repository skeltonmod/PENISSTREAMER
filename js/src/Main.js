import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Watch from "./Watch";
import Stream from "./Stream";
import PageGuard from "./PageGuard";

class Main extends React.Component {
  render() {
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
            <Route path='/:type/view/:title'>
              <PageGuard component={Stream}/>
            </Route>
          </Switch>
        </Router>

      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('app')
);
