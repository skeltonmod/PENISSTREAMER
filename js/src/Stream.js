import React from 'react';
import 'regenerator-runtime/runtime';
import cheerio from 'cheerio'
import doCORSRequest from "../CORS_POST";
import ReactPaginate from 'react-paginate';

class Stream extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      source: "", //video
      canonical_name: "",
      titleList: [], // the global list (used for reference)
      renderedTitleList: [], // Render this instead
      ep_count: 0,
      limit: 0,
      page_count: 0,
      episode_link: ""
    }
    this.parseEpisode = this.parseEpisode.bind(this);
    this.nextPage = this.nextPage.bind(this)
  }



  async componentDidMount() {
    let temp_array = []
    await this.setState({limit: 7})

    // get the title name
    await this.setState({canonical_name: String(window.location.href).split("/")[5]})

    // do crawl
    const request = await doCORSRequest({url:`https://www.wcostream.com/anime/${this.state.canonical_name}`, method: "GET"}).
    then((r)=>{return r.data})

    // console.log(request)
    const $ = cheerio.load(request)

    $('#catlist-listview > ul:nth-child(1) > li > a').each((i, link)=>{
      temp_array.push({title: String(link.attribs.title).split('Watch ')[1], link: String(link.attribs.href).split("/")[3]})

    })

    await this.setState({titleList: temp_array, ep_count: Math.ceil(temp_array.length / this.state.limit), renderedTitleList: temp_array.slice(0, 7)})

  }

  async nextPage(e){
    let offset = Math.ceil(e.selected * this.state.limit)

    await this.setState({page_count: offset})

    // render the list
    this.setState({renderedTitleList: this.state.titleList.slice(this.state.page_count, this.state.page_count + this.state.limit)})
  }

  async parseEpisode(e){
    // crawl for episode
    let arrayBin = [];
    let URI = ""
    let arrayKey = 0;

    const request = await doCORSRequest({url:`https://www.wcostream.com/${e.target.name}`, method: "GET"}).
    then((r)=>{return r.data})

    // console.log(request)

    let $ = cheerio.load(request)
    $('script').each((i, link)=>{
      if(i === 7){

        // Decode crappy indonesian encryption
        arrayBin = String(String(link.children[0].data).match('(?<=\\[).+?(?=\\])')[0]).split(', ')
        arrayKey = String(link.children[0].data).match('\\d+\\d+\\d+\\d+')
      }
    })

    arrayBin.forEach(function (value) {
      // console.log(value)
      URI += String.fromCharCode(parseInt(atob(String(value).replace(/['"]+/g,'')).replace(/\D/g,'')) - parseInt(arrayKey));

    });

    console.log(URI)

    $ = cheerio.load(URI)

    await this.setState({episode_link: $('iframe')[0].attribs.src});

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
      <div className="row">
        <div className="col">
          <div className="jumbotron my-6">
           <center>
             {this.state.episode_link ? <iframe
               src={"https://www.wcostream.com/"+this.state.episode_link}
               scrolling="no"
               allowFullScreen="yes" rel="nofollow" data-ex-slot-check="iframe_ex_slot_1"
               width="530" height="440" frameBorder="0"/>: "No Video Loaded"}
           </center>


          </div>
        </div>
        <div className="col-md-5">
          <div className="jumbotron my-6">
            <h1>Episode List</h1>
            <hr/>
            <div className="list-group bg-dark">
              <Append list={this.state.renderedTitleList}>
                {(index) => <a name={this.state.renderedTitleList[index].link} onClick={this.parseEpisode} className="list-group-item list-group-item-action" href="#" key={index}>{this.state.renderedTitleList[index].title}</a>}
              </Append>

            </div>
            {this.state.titleList.length > 0 ? <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={this.state.ep_count}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.nextPage}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />: "Loading List"}
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Stream;
