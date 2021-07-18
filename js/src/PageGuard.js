import React from "react";
import {Redirect, useHistory} from "react-router-dom";
import Navbar from "./Navbar";

const PageGuard = (props) => {
  const history = useHistory();
  const [auth, setAuth] = React.useState(false)

  if (localStorage.length > 0) {
    React.useEffect(() => {
      setAuth(true)
    })

  }else{
    history.push('/')
  }

  const Component = props.component;
  return (
    <div>
      {auth && <Navbar/>}
      {auth && <Component/>}

    </div>
  );
};
export default PageGuard;
