import React from "react";
import axios from "axios";
import { Redirect} from "react-router-dom";

class Register extends React.Component {
  constructor(props) {
    super();

    this.state = {
      "username": "",
      "email": "",
      "password": "",
      "number": "",
      status: null
    }
    this.handleChange=this.handleChange.bind(this);
    this.onSubmit=this.onSubmit.bind(this);
  }

  handleChange(e){
    let data = {};
    data[e.target.name]=e.target.value;
    this.setState(data)
  }

  onSubmit(e){
    e.preventDefault();
    let formData = new FormData(document.getElementById('form'));

    const request = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        "username": formData.get('username'),
        "email": formData.get('email'),
        "password": formData.get('password'),
        "number": formData.get('number'),
      }

      return await axios.post("http://127.0.0.1:8000/api/register", body, header).then((response) => {
        return response.data
      })
    }


    request().then(r => {
      try{
        if(~r.token){
          this.setState({status: "success"})
          alert("Account Created Successfully")
        }
      }catch (e) {
        console.log(e)
        this.setState({status: "failed"})
      }

    }).catch((error) => {
      this.setState({status: "failed"})
    })
  }

  render() {
    return <div>
      {(this.state.status === "redirect" || this.state.status === "redirect") && <Redirect to='/'/>}
      <div className="bs-component my-5 ">
        <div className="card text-white bg-danger">
          <div className="card-header bg-warning">Create Account {String(this.state.status)}
            <button type="button" className="close" onClick={() => {this.setState({status: "redirect"})}} data-dismiss="alert">x</button>
          </div>
          <div className="card-body">
            <div className="card-text text-white">
              <form onSubmit={this.onSubmit} id="form">
                <div className="form-group mb-5 col-4">
                  <label className="col-form-label col-form-label-lg"  htmlFor="inputLarge">Username</label>
                  <input className="form-control form-control-lg" value={this.state.username} onChange={this.handleChange} name="username" type="text"/>
                </div>
                <div className="form-group mb-5 col-4">
                  <label className="col-form-label col-form-label-lg"  htmlFor="inputLarge">Email</label>
                  <input className="form-control form-control-lg" value={this.state.email} onChange={this.handleChange} name="email" type="email"/>
                </div>
                <div className="form-group mb-5 col-4">
                  <label className="col-form-label col-form-label-lg"  htmlFor="inputLarge">Password</label>
                  <input className="form-control form-control-lg" value={this.state.password} onChange={this.handleChange} name="password" type="password"/>
                </div>
                <div className="form-group mb-5 col-4">
                  <label className="col-form-label col-form-label-lg"  htmlFor="inputLarge">Phone Number</label>
                  <input className="form-control form-control-lg" value={this.state.number} onChange={this.handleChange} name="number" type="number"/>
                </div>


                <p className="lead">
                  <button type="submit" className="btn mx-5 btn-outline-primary" role="button">Register</button>
                </p>
              </form>


            </div>
          </div>
        </div>
      </div>
    </div>;
  }

}

export default Register
