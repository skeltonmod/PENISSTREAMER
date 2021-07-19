import React from 'react';
import {useFormik} from "formik";
import * as yup from 'yup';
import axios from "axios";



class CheckFriendState extends React.Component{
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this)
  }

  clickHandler(e){
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
            first_user: JSON.parse(localStorage.getItem('credentials')).id,
            // Your Supposed Friend
            second_user: e.target.id,
            // Who added who?
            acted_user: JSON.parse(localStorage.getItem('credentials')).id,
            status: "pending",
            userid: JSON.parse(localStorage.getItem('credentials')).userid,

          }
          return await axios.post("http://127.0.0.1:8000/api/sendFriendRequest", body, header).then((response) => {
            return response
          })
        }

        add().then(
          (r)=>{
            // console.log(r.data[0].status)
            // setFriendState(r.data[0].status)
            console.log(r)
          }
        )
        break;
      case "accept":
        alert("Decline")
        break;

    }

    window.location.href = String(window.location.href)
  }

  render() {
    switch (this.props.state){
      case '':
        return <button className="btn btn-success" id={this.props.id} name="add" onClick={this.clickHandler}>Add Friend</button>
      case 'pending':
        return <button className="btn btn-primary" id={this.props.id} disabled>Request Sent</button>

      case 'confirmed':
        return <div>
          <button className="btn btn-primary" id={this.props.id}>Friends</button>
          <button className="btn btn-primary" id={this.props.id}>Send Message</button>
        </div>

      case 'acceptable':
        return <div>
          <button className="btn btn-success mx-3" name="accept" id={this.props.id}>Accept Friend Request</button>
          <button className="btn btn-danger" name="decline" id={this.props.id}>Deny Friend Request</button>
        </div>

      default:
        return <div><button className="btn btn-info" name="accept" id={this.props.id}>Loading...</button></div>
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
    alert(e.target.name)
  }

  async componentDidMount() {
    this._isMounted = true;
    const getUserProfile = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        "userid": String(window.location.href).split('/')[4],
      }
      return await axios.post("http://127.0.0.1:8000/api/getUserFeed", body, header).then((response) => {
        return response
      })
    }

    if(this._isMounted){
      getUserProfile().then(r => {
        console.log(r)
        this.setState({profileData: r.data[0]}, function (){
          const getFriendState = async () =>{
            const header = {
              headers:{
                "Accept": "application/json"
              }
            }
            const body = {
              "id": this.state.profileData.id,
            }
            return await axios.post("http://127.0.0.1:8000/api/getFriendState", body, header).then((response) => {
              return response
            })
          }
          getFriendState().then(r => {

            if(r.data[0][0] === undefined && r.data[1]){ // for the recipient
              this.setState({friendState: "acceptable"})
            }else{
              this.setState({friendState: (r.data[0][0] !== undefined && r.data[0][0].status)}) // set status for sender
            }

          })
        })
      })
    }

    console.log(this.state.profileData)
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
            <CheckFriendState id={this.state.profileData.id} state={this.state.friendState}/>
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
