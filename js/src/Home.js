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
    let temp_array = [];

    // life saver!
    const request = await axios.get('http://api.allorigins.win/get?url=https://www.wcostream.com/#cartoon').then(
      (response)=> {

        return response.data.contents
      }
    )
    const $ = cheerio.load(request)

    $('#content > div:nth-child(5) > div:nth-child(5) > div:nth-child(2) > ul:nth-child(1) > li > div:nth-child(2) > a').each((i, link)=>{
      temp_array.push({title: link.children[0].data, link: String(link.attribs.href).split('/')[3]})
    })

    this.setState({titleList: temp_array})
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
          <h1 className="display-3">Recently Updated Shows</h1>

          <hr className="my-4"/>
          <div className="lead align-content-center">
            <center>
              {this.state.titleList.length === 0 ? "Loading Anime Feed" : ""}
              <Append list={this.state.titleList}>
                {(index) => <ItemCard class={"btn btn-info mx-5 my-2"} link={"/cartoon/view/"+this.state.titleList[index].link} key={index} name={this.state.titleList[index].title}/>}
              </Append>
            </center>


          </div>
        </div>
      </div>
    </div>;
  }
}

export default Home;
