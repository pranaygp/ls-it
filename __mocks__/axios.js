const _ = require('lodash')
const responses = {
  "https://tv-v2.api-fetch.website/show/tt4179452": {
    title: 'Show 1',
    episodes: [
      { tvdb_id: 1 }
    ]
  },
  "https://tv-v2.api-fetch.website/show/tt3530232": {
    title: 'Show 2',
    episodes: [
      { tvdb_id: 2 }
    ]
  },
  "https://tv-v2.api-fetch.website/show/tt2575988": {
    title: 'Show 3',
    episodes: [
      { tvdb_id: 3 }
    ]
  }
}

module.exports = url => {
  switch(url){
    case "https://tv-v2.api-fetch.website/show/tt4179452":
      let data =  _.cloneDeep(responses[url]) // deep copy response
      responses[url]
        .episodes
        .push({
          tvdb_id: 4
        })
      return Promise.resolve({
        data
      })
    case "https://tv-v2.api-fetch.website/show/tt3530232":
    case "https://tv-v2.api-fetch.website/show/tt2575988":
      return Promise.resolve({
        data: responses[url]
      })
    default:
      return Promise.reject("Unknown Mock Endpoint")
  }
}