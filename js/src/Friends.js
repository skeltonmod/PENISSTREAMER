import React from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";

class Friends extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      friendsList: [],
      searchText: "",
      renderedFriendsList: [],
      page_count: 0,
      friend_count: 0,
      limit: 0,
      isSearching: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.nextPage = this.nextPage.bind(this);
    this.searchUser = this.searchUser.bind(this);
  }

  fetchData(){

    const fetch = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        id: JSON.parse(localStorage.getItem('credentials')).id,
      }
      return await axios.post("http://127.0.0.1:8000/api/getFriends", body, header).then((response) => {
        return response
      })
    }

    fetch().then(
      (r)=>{
        if(r.data[0]){
          console.log(r.data[0])
          this.setState({friendsList: r.data}, function (e){
            this.setState({renderedFriendsList: this.state.friendsList.slice(0, 4), friend_count: Math.ceil(this.state.friendsList.length / this.state.limit)}, function (){
              console.log(this.state.renderedFriendsList)
            })
          })

        }
      }
    )
  }

  searchUser(){
    const fetch = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        username: this.state.searchText,
      }
      return await axios.post("http://127.0.0.1:8000/api/searchFriends", body, header).then((response) => {
        return response
      })
    }

    fetch().then(
      (r)=>{
        if(r.data[0]){
          console.log(r.data[0])
          this.setState({friendsList: r.data}, function (e){
            this.setState({renderedFriendsList: this.state.friendsList.slice(0, 4), friend_count: Math.ceil(this.state.friendsList.length / this.state.limit)}, function (){
              console.log(this.state.renderedFriendsList)
            })
          })

        }
      }
    )
  }

  async nextPage(e){
    let offset = Math.ceil(e.selected * this.state.limit)

    await this.setState({page_count: offset})

    // render the list
    this.setState({renderedFriendsList: this.state.friendsList.slice(this.state.page_count, this.state.page_count + this.state.limit)})
  }

  handleChange(e){
    this.setState({[e.target.name] : e.target.value})
  }

  async componentDidMount() {
    await this.setState({limit: 4})
    // Get Friends
    this.fetchData()
  }

  render() {
    function Append(props){
      let items = []
      props.list.map(function (value, index){
        items.push(props.children(index))
      })

      return <div>{items}</div>
    }
    return (
      <div>
        <div className="bs-component my-5">
          <div className="row d-flex justify-content-center">
            <div className="col-md-8">
              <h4>Friends</h4>
              <div className="jumbotron">
               <div className="row">
                 <div className="col-md-6">
                   <label>Search for friends</label>
                   <form className="form-inline my-lg-0">
                     <input className="form-control mr-sm-2" type="text" name="searchText" onChange={this.handleChange} value={this.state.searchText} placeholder="Search"/>
                       <button className="btn btn-info my-sm-0" onClick={this.searchUser} type="button">Search</button>
                   </form>
                 </div>
               </div>
               <div className="row">
                 <div className="col">
                   <div className="list-group ">

                     <Append list={this.state.renderedFriendsList}>
                       {(index) =>
                         <a href={"/profile/"+this.state.renderedFriendsList[index].userid} key={this.state.renderedFriendsList[index].id} className="list-group-item text-danger list-group-item-action">{this.state.renderedFriendsList[index].username}</a>
                       }
                     </Append>


                   </div>
                   {this.state.renderedFriendsList.length > 0 ? <ReactPaginate
                     previousLabel={'<'}
                     nextLabel={'>'}
                     breakLabel={'...'}
                     breakClassName={'break-me'}
                     pageCount={this.state.friend_count}
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
          </div>

        </div>
      </div>
    );
  }
}

export default Friends;
