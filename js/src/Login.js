import React from "react";
import {Link, Redirect} from "react-router-dom";
import 'regenerator-runtime/runtime';
import axios from 'axios';

class Login extends React.Component {
  constructor() {
    super();

    this.state={
      username:'',
      password:'',
      status: ''
    };

    this.handleChange=this.handleChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
  }

  handleChange(e){
    let data = {};
    data[e.target.name]=e.target.value;
    this.setState(data)
  }




  onSubmit(e){
    e.preventDefault()
    const request = async () =>{
      const headers = {
        headers:{
          "Accept": "application/json"
        }
      }

      const body = {
        username: this.state.username,
        password: this.state.password
      }

      return await axios.post('http://127.0.0.1:8000/api/login', body, headers).then(function (response) {
        return response;
      });
    }
    // Always call async for non create-react apps :(
    request().then(r=>{
      if(~r.data.token){
        localStorage.setItem('credentials', JSON.stringify(r.data.login))
        localStorage.setItem('token', JSON.stringify(r.data.token))
        this.setState({loggedIn: true})
      }
    })
  }
  render() {
    return (
      <div>
        <div className="bs-component my-5 ">
          <div className="card text-white bg-danger">
            <div className="card-header bg-warning">Authentication Required</div>
            <div className="card-body">
              <h4 className="card-title mb-5">Please Login</h4>
              <div className="card-text text-white">
                <form onSubmit={this.onSubmit}>
                  <div className="form-group mb-5 col-4">
                    <label className="col-form-label col-form-label-lg" htmlFor="inputLarge">Username</label>
                    <input className="form-control form-control-lg" value={this.state.username} onChange={this.handleChange} name="username" type="text"/>
                  </div>
                  <div className="form-group mb-5 col-4">
                    <label className="col-form-label col-form-label-lg"  htmlFor="inputLarge">Password</label>
                    <input className="form-control form-control-lg" value={this.state.password} onChange={this.handleChange} name="password" type="password"/>
                  </div>

                  <p className="lead">
                    <button type="submit" className="btn mx-5 btn-warning btn-lg" role="button">Login</button>
                    <button type="button" onClick={() => {window.location.href = "/register"}} className="btn mx-5 btn-primary btn-lg" role="button">Register</button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {this.state.loggedIn && <Redirect to='/home'/>}
        {localStorage.length > 0 &&  <Redirect to='/home'/>}
      </div>
    );
  }
}

export default Login
