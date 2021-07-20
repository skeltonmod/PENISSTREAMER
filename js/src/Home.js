import React from 'react';
import 'regenerator-runtime/runtime';
import axios from "axios";
import ReactPaginate from "react-paginate";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedList: [],
      renderedfeedList: [],
      tweet: "",
      page_count: 0,
      feed_count: 0,
      limit: 0
    }
    this.sendTweet = this.sendTweet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  async fetchData(){
    const fetch = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        id: JSON.parse(localStorage.getItem('credentials')).id,
      }
      return await axios.post("http://127.0.0.1:8000/api/getFeedFromFriends", body, header).then((response) => {
        return response
      })
    }

    fetch().then(
      (r)=>{
        console.log(r.data)
        this.setState({feedList: r.data[0].concat(r.data[1])}, function (e){
          this.setState({renderedfeedList: this.state.feedList.slice(0, 4), feed_count: Math.ceil(this.state.feedList.length / this.state.limit)}, function (){
            console.log(this.state.renderedfeedList)
          })
        })
      }
    )
  }


  async componentDidMount() {
    await this.setState({limit: 4})

    await this.fetchData()
    console.log(this.state.renderedfeedList)
  }

  async nextPage(e){
    let offset = Math.ceil(e.selected * this.state.limit)

    await this.setState({page_count: offset})

    // render the list
    this.setState({renderedfeedList: this.state.feedList.slice(this.state.page_count, this.state.page_count + this.state.limit)})
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
        this.fetchData()
      }
    )
  }

  handleChange(e){
    let data = {}
    data[e.target.name]=e.target.value;
    this.setState(data)
  }


  render() {
    function Append(props){
      let items = []
      props.list.map(function (value, index){
        items.push(props.children(index))
      })

      return <div>{items}</div>
    }


    return <div>
      <div className="bs-component my-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-8">
            <h4>User Feed</h4>

            <div className="bs-component" style={{maxHeight: "400px", overflow: "auto"}}>
              <div className="list-group">


                <Append list={this.state.renderedfeedList}>
                  {(index) =>
                    <a href="#" className="list-group-item list-group-item-action flex-column align-items-start active">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">!!!</h5>
                    <small>{this.state.renderedfeedList[index].datetime_submitted}</small>
                    </div>
                    <p className="mb-1">{this.state.renderedfeedList[index].tweet}</p>
                    <small>{this.state.renderedfeedList[index].userid}</small>
                    </a>
                  }
                </Append>

                {this.state.renderedfeedList.length > 0 ? <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={this.state.feed_count}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.nextPage}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                />: "Loading List"}

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
