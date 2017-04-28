// @flow
const axios = require('axios')
const _ = require('lodash')

async function getData(config: { shows: Array<string> }): Promise<Array<any>>{
  try{
    const responses: Array<{ data: { episodes: Array<any>, title: string } }> = await Promise.all(config.shows.map((id: string) => axios('https://tv-v2.api-fetch.website/show/' + id)))

    return _.flatMap(responses, (r): Array<any> => r.data.episodes.map(episode => Object.assign({}, episode, { title: r.data.title }))) 

  } catch(e){
    console.error("Failed to fetch Popcorn Time stuff")
    return []
  }
}

module.exports = getData