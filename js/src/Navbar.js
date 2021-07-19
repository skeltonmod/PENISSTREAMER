import React from "react";

const Navbar = () => {
  const [navbarName, setnavbarName] = React.useState("");
  const [canonical, setCanonical] = React.useState("");
  const [profileLink, setprofileLink] = React.useState("");
  const [auth, setAuth] = React.useState(false);

  function onLogout(){
    localStorage.clear();
  }

  React.useEffect(()=>{
    const data = localStorage.getItem('credentials')

    if(data){
      window.addEventListener('storage', ()=>{
        setnavbarName(JSON.parse(localStorage.getItem('credentials')).username)
        setprofileLink(JSON.parse(localStorage.getItem('credentials')).userid)
      })
      window.dispatchEvent( new Event('storage'))
    }

  })

  // <a className="navbar-brand" href={"/profile/"+JSON.parse(localStorage.getItem('credentials')).userid}>{JSON.parse(localStorage.getItem('credentials')).userid}</a>

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href={"/profile/"+profileLink}>{navbarName}</a>
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
          <a className="nav-link text-danger" onClick={onLogout} href="/">Logout</a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
