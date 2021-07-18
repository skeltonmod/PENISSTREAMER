import React from "react";
import 'regenerator-runtime/runtime';
import axios from "axios";
import cheerio from 'cheerio'
import ItemCard from "./Components/ItemCard";
import doCORSRequest from '../CORS_POST'




class Watch extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      titleList: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  handleChange(e){
    let data = {};
    data[e.target.name]=e.target.value;
    this.setState(data)
  }



  async onSubmit(e){
    e.preventDefault();
    let temp_array = [];
    const request = await doCORSRequest({url:'https://www.wcostream.com/search',data: `catara=${this.state.name}&konuara=series`, method: "POST"}).
    then((r)=>{return r.data})

    console.log(request)

    const $ = cheerio.load(request)

    $('.aramadabaslik > a').each((i, link)=>{
      temp_array.push({title: link.attribs.title, link: String(link.attribs.href).split("/")[2]})
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
      <div className="bs-component my-5 ">
        <div className="card text-white bg-danger">
          <div className="card-header bg-warning">Search for shows</div>
          <div className="card-body">
            <div className="card-text text-white">
              <form onSubmit={this.onSubmit} id="form">
                <div className="form-group mb-5 col-4">
                  <label className="col-form-label col-form-label-lg"  htmlFor="inputLarge">Title</label>
                  <input className="form-control form-control-lg" value={this.state.name} onChange={this.handleChange} name="name" type="text"/>
                </div>
                <p className="lead">
                  <button type="submit" className="btn mx-5 btn-outline-primary" role="button">Search</button>
                </p>
              </form>

            </div>
          </div>
        </div>
      </div>
      {this.state.titleList.length > 0 && <div className="list-group">
        <Append list={this.state.titleList}>
          {(index) => <ItemCard class={"list-group-item list-group-item-action"} link={"/anime/view/"+this.state.titleList[index].link} key={index} name={this.state.titleList[index].title}/>}
        </Append>
      </div>}
    </div>;
  }
}

// TODO: list-group-item list-group-item-action

export default Watch
