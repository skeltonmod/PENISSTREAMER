import React from 'react';
import ItemCard from "./Components/ItemCard";
import 'regenerator-runtime/runtime';
import jsonp from 'jsonp'
import axios from "axios";
import cheerio from 'cheerio'
import {useFormik} from "formik";
import * as yup from 'yup';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedList: [],
      tweet: ""
    }
    this.sendTweet = this.sendTweet.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {

  }

  async sendTweet(){
    const post = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        poster: JSON.parse(localStorage.getItem('credentials')).id,
        userid: JSON.parse(localStorage.getItem('credentials')).userid,
        tweet: this.state.tweet,

      }
      return await axios.post("http://127.0.0.1:8000/api/postFeed", body, header).then((response) => {
        return response
      })
    }

    post().then(
      (r)=>{
        console.log(r)
        this.setState({tweet: ""})
      }
    )
  }

  handleChange(e){
    let data = {}
    data[e.target.name]=e.target.value;
    this.setState(data)
  }


  render() {
    return <div>
      <div className="bs-component my-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-8">
            <h4>User Feed</h4>

            <div className="bs-component" style={{maxHeight: "400px", overflow: "auto"}}>
              <div className="list-group">
                {/*<a href="#" className="list-group-item list-group-item-action flex-column align-items-start active">*/}
                {/*  <div className="d-flex w-100 justify-content-between">*/}
                {/*    <h5 className="mb-1">List group item heading</h5>*/}
                {/*    <small>3 days ago</small>*/}
                {/*  </div>*/}
                {/*  <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus*/}
                {/*    varius blandit.</p>*/}
                {/*  <small>Donec id elit non mi porta.</small>*/}
                {/*</a>*/}
                {/*<a href="#" className="list-group-item list-group-item-action flex-column align-items-start active">*/}
                {/*  <div className="d-flex w-100 justify-content-between">*/}
                {/*    <h5 className="mb-1">List group item heading</h5>*/}
                {/*    <small>3 days ago</small>*/}
                {/*  </div>*/}
                {/*  <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus*/}
                {/*    varius blandit.</p>*/}
                {/*  <small>Donec id elit non mi porta.</small>*/}
                {/*</a>*/}
                {/*<a href="#" className="list-group-item list-group-item-action flex-column align-items-start active">*/}
                {/*  <div className="d-flex w-100 justify-content-between">*/}
                {/*    <h5 className="mb-1">List group item heading</h5>*/}
                {/*    <small>3 days ago</small>*/}
                {/*  </div>*/}
                {/*  <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus*/}
                {/*    varius blandit.</p>*/}
                {/*  <small>Donec id elit non mi porta.</small>*/}
                {/*</a>*/}

                {this.state.feedList.length > 0 ? "Feed Loaded" : <center>"No Feeds"</center>}

              </div>
            </div>


          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-md-5">


            <div className="jumbotron">
              <form>
                <textarea className="form-control bg-dark" value={this.state.tweet} onChange={this.handleChange} name="tweet" rows="2" cols="5"/>
                <button type="button" onClick={this.sendTweet} className="btn btn-info btn-lg btn-block my-5"><center>Tweet</center></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Home;
