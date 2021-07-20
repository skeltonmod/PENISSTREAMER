import React from 'react';
import {useFormik} from "formik";
import * as yup from 'yup';
import axios from "axios";



class CheckFriendState extends React.Component{
  constructor(props) {
    super(props);
  }



  render() {
    switch (this.props.state){
      case 'add':
        return <button className="btn btn-success" id={this.props.id} name="add" onClick={this.props.handler}>Add Friend</button>
      case 'pending':
        return <button className="btn btn-primary" id={this.props.id} onClick={this.props.handler} disabled>Request Sent</button>

      case 'confirmed':
        return <div>
          <button className="btn btn-success mr-3 disabled" id={this.props.id} onClick={this.props.handler}>Friends</button>
          <button className="btn btn-primary mr-3" id={this.props.id} onClick={this.props.handler}>Send Message</button>
          <button className="btn btn-danger" name="decline" id={this.props.id} onClick={this.props.handler}>Unfriend</button>
        </div>

      case 'acceptable':
        return <div>
          <button className="btn btn-success mr-3" name="accept" id={this.props.id} onClick={this.props.handler}>Accept Friend Request</button>
          <button className="btn btn-danger" name="decline" id={this.props.id} onClick={this.props.handler}>Deny Friend Request</button>
        </div>

      default:
        return <button className="btn btn-success" id={this.props.id} name="add" onClick={this.props.handler}>Loading...</button>
    }
  }
}

class ViewProfile extends React.Component{


  constructor(props) {
    super(props);
    this.state = {
      friendState: "",
      profileData: {},

    }
    this._isMounted = false;

    this.clickHandler = this.clickHandler.bind(this)
  }

  clickHandler(e){
    // alert(e)
    switch (e.target.name){
      case "add":
        const add = async () =>{
          const header = {
            headers:{
              "Accept": "application/json"
            }
          }
          const body = {
            // You
            acted_user: JSON.parse(localStorage.getItem('credentials')).id,
            // Your Supposed Friend
            second_user: e.target.id,

          }
          return await axios.post("http://127.0.0.1:8000/api/sendFriendRequest", body, header).then((response) => {
            return response
          })
        }

        add().then(
          (r)=>{
            this.setState({friendState: "pending"})
          }
        )
        break;
      case "accept":
        const accept = async () =>{
          const header = {
            headers:{
              "Accept": "application/json"
            }
          }
          const body = {
            // You
            acted_user: e.target.id,
            // Your Supposed Friend
            second_user: JSON.parse(localStorage.getItem('credentials')).id,

          }
          return await axios.post("http://127.0.0.1:8000/api/acceptRequest", body, header).then((response) => {
            return response
          })
        }

        accept().then(
          (r)=>{
            this.setState({friendState: "confirmed"})
          }
        )
        break;

    }
  }

  async componentDidMount() {
    this._isMounted = true;
    const getProfileData = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        "userid": String(window.location.href).split('/')[4]
      }
      return await axios.post('http://127.0.0.1:8000/api/getProfileData', body, header).then(function (r){
        return r
      })

    }
    await getProfileData().then(r => {

      this.setState({profileData: r.data[0]}, function (){
        const getFriendRequestStatus = async () =>{
          const header = {
            headers:{
              "Accept": "application/json"
            }
          }
          const body = {
            // You
            acted_user: JSON.parse(localStorage.getItem('credentials')).id,
            // Your Supposed Friend
            second_user: this.state.profileData.id,
          }
          return await axios.post('http://127.0.0.1:8000/api/getFriendRequestState', body, header).then(function (r){
            return r
          })
        }

        getFriendRequestStatus().then(r =>{
          console.log(r)
          if(!r.data[2]){
            if(r.data[0] && !r.data[1]){
              this.setState({friendState: "acceptable"})
            }else if (!r.data[0] && r.data[1]){
              this.setState({friendState: "pending"})
            }else{
              this.setState({friendState: "add"})
            }
          }else{
            this.setState({friendState: "confirmed"})
          }


        })
      })
    })
  }

  async componentWillUnmount(){
    this._isMounted = false;


  }


  render() {
    return <div className="row">
      <div className="col-md">

        <div className="card text-white bg-info mb-3 ">
          <div className="card-header">{this.state.profileData.username} Account Details</div>
          <div className="card-body align-content-center">
            <span className="text-warning">Username:</span> <b>{this.state.profileData.username}</b><br/><br/>
            <span className="text-warning">Account Created:</span><b>{String(new Date(this.state.profileData.created_at))}</b>
            <br/><br/>
            <CheckFriendState id={this.state.profileData.id} state={this.state.friendState} handler={this.clickHandler}/>
          </div>

        </div>

      </div>
      <div className="col-md">

        <div className="card text-white bg-info mb-3 ">
          <div className="card-header"><center>{this.state.profileData.username} Feed</center></div>
          <div className="card-body align-content-center">

          </div>
        </div>

      </div>
    </div>
  }
}

const Profile = (props) =>{
  const validationSchema = yup.object({
    username: yup.string().required('Username required'),
    email: yup.string().email("Please enter a valid email address"),
    password: yup.string().min(3, "Please enter a strong password").required(),
    number: yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Invalid Number"),
  })

  const [privs, SetPrivs] = React.useState(false)

  const onSubmit =  () => {
    // submit form
    const request = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        "id": JSON.parse(localStorage.getItem('credentials')).id,
        "username": formik.values.username,
        "email": formik.values.email,
        "password": formik.values.password,
        "number": formik.values.number,
        "userid": JSON.parse(localStorage.getItem('credentials')).userid,
      }
      return await axios.post("http://127.0.0.1:8000/api/editUser", body, header).then((response) => {
        return response
      })


    }

    request().then(r => {
      alert("Account Edited Successfully")
      localStorage.setItem('credentials', JSON.stringify(r.data.login))
    })


  }

  const formik = useFormik({
    initialValues: { username: JSON.parse(localStorage.getItem('credentials')).username,
      email: JSON.parse(localStorage.getItem('credentials')).email,
      password: "",
      number: JSON.parse(localStorage.getItem('credentials')).number },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  })




  React.useEffect(()=>{
    if(JSON.parse(localStorage.getItem('credentials')).userid === String(window.location.href).split('/')[4]){
      SetPrivs(true)
    }
  })



  return <div className="bs-component my-5 ">
    <div className="jumbotron mb-3">
      {privs ? <div className="row">
        <div className="col-md-6">

          <div className="card text-white bg-info mb-3 h-50">
            <div className="card-header">Edit Account Credentials</div>
            <div className="card-body align-content-center">
              <form id="form">
                <div className="form-row">
                  <div className="form-group mb-5 col-6 ">
                    <label className="col-form-label col-form-label-lg bg-warning"  htmlFor="inputLarge">Username</label>
                    <input className="form-control form-control-lg bg-warning" onBlur={formik.handleBlur} value={formik.values.username} onChange={formik.handleChange} name="username" type="text"/>
                    <p className="text-danger">
                      {formik.touched.username && formik.errors.username ?
                        formik.errors.username
                        :
                        ""
                      }
                    </p>
                  </div>
                  <div className="form-group mb-5 col-6">
                    <label className="col-form-label col-form-label-lg bg-warning"  htmlFor="inputLarge">Email</label>
                    <input className="form-control form-control-lg bg-warning" onBlur={formik.handleBlur} value={formik.values.email} onChange={formik.handleChange} name="email" type="email"/>
                    <p className="text-danger">
                      {formik.touched.email && formik.errors.email ?
                        formik.errors.email
                        :
                        ""
                      }
                    </p>
                  </div>
                  <div className="form-group mb-5 col-6">
                    <label className="col-form-label col-form-label-lg bg-warning"  htmlFor="inputLarge">Password</label>
                    <input className="form-control form-control-lg bg-warning" onBlur={formik.handleBlur} value={formik.values.password} onChange={formik.handleChange} name="password" type="password"/>

                    <p className="text-danger">
                      {formik.touched.password && formik.errors.password ?
                        formik.errors.password
                        :
                        ""
                      }
                    </p>
                  </div>
                  <div className="form-group mb-5 col-6">
                    <label className="col-form-label col-form-label-lg bg-warning"  htmlFor="inputLarge">Phone Number</label>
                    <input className="form-control form-control-lg bg-warning" onBlur={formik.handleBlur} value={formik.values.number} onChange={formik.handleChange} name="number" type="text"/>
                    <p className="text-danger">
                      {formik.touched.number && formik.errors.number ?
                        formik.errors.number
                        :
                        ""
                      }
                    </p>
                  </div>
                </div>
                <p className="lead">
                  <button type="button" onClick={onSubmit} className="btn btn-primary btn-lg btn-block" role="button">Edit Account</button>
                </p>
              </form>
            </div>
          </div>

        </div>
        <div className="col-md-6">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Account Options</div>
            <div className="card-body align-content-center">
              <button className="btn btn-info" type="button">Purchase Premium</button>
              <p className="text-white my-2">By Purchasing a premium pass, you will be supporting this project</p>
              <button className="btn btn-danger" type="button">Delete Account</button>
              <p className="text-white my-2">You'll be asked only once</p>
            </div>
          </div>

        </div>
      </div> : <ViewProfile/>}
    </div>
  </div>
}


export default Profile;
