import 'regenerator-runtime/runtime';
import axios from "axios";

let cors_api_url = "http://localhost:8080/"

async function doCORSRequest(options, timeout = 0) {
  let request = null
  if(options.method === "POST"){

    // POST REQUEST
    // A bit tricky
    request = await axios.post(`${cors_api_url}${options.url}`, options.data, {
      "Content-Type": "application/x-www-form-urlencoded"
    }).then(
      (response)=> {
        return response
      }
    )

  }else{
    // GET REQUEST
    request = await axios.get(`${cors_api_url}${options.url}`,{
      headers:{
        "X-Requested-With": "XMLHttpRequest"
      }
    }).then(
      (response)=> {
        return response
      }
    )
  }

  return request
}

export default doCORSRequest


