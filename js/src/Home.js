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

    function Append(props){
      let items = []
      for(let i = 0; i < props.list.length; i++){
        items.push(props.children(i))
      }
      return <p>{items}</p>
    }

    return <div>
      <div className="bs-component my-5">
        <div className="jumbotron">
          <h1 className="display-3">News Feed</h1>

          <hr className="my-4"/>
          <div className="lead align-content-center">
            <center>

            </center>


          </div>
        </div>
      </div>
    </div>;
  }
}

export default Home;
