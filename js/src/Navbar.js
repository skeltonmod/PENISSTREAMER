import React from "react";

class Navbar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      to: "",
      navbarName: JSON.parse(localStorage.getItem('credentials')).username
    }
  }

  onLogout(){
    localStorage.clear();
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="#">{this.state.navbarName}</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01"
                  aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          </button>

          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="/home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Friends</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/watch">Watch</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Chat (Experimental)</a>
              </li>
            </ul>
            <a className="nav-link" onClick={this.onLogout} href="/">Logout</a>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar
