import React from "react";
import {useHistory} from "react-router-dom";
import Navbar from "./Navbar";

const PageGuard = (props) => {
  const history = useHistory();
  const [auth, setAuth] = React.useState(false)



  if (localStorage.getItem('credentials')) {
    React.useEffect(() => {
      setAuth(true)
    })

  }else{
    history.push('/')
  }

  const Component = props.component;
  return (
    <div>
      {auth && <div><Navbar/><Component/></div>}
    </div>
  );
};
export default PageGuard;
