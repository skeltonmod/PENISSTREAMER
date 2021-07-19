import React from 'react';
import ItemCard from "./Components/ItemCard";
import 'regenerator-runtime/runtime';
import jsonp from 'jsonp'
import axios from "axios";
import cheerio from 'cheerio'


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleList: []
    }

  }

  async componentDidMount() {

  }



  render() {
    return <div>
      <div className="bs-component my-5">

        <div className="row my-2">
          <div className="col bg-dark">
            <div className="bg-dark text-white">
              <span>News Feed</span>
              <div className="lead align-content-center">

                <div className="list-group">
                  <a href="#" className="list-group-item list-group-item-action flex-column align-items-start active">
                    <div className="d-flex w-100 justify-content-between">
                      <h4 className="mb-1">Someone</h4>
                      <small>3 days ago</small>
                    </div>
                    <p className="mb-1">

                    </p>
                    <small>

                    </small>
                  </a>
                </div>


              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <form>
              <textarea className="form-control bg-dark text-white" id="exampleTextarea" rows="3"/>
              <button type="button" className="btn btn-primary btn-lg btn-block my-5"><center>Publish</center></button>

            </form>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Home;
