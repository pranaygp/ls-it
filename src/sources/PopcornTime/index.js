// @flow
const axios = require('axios')
const _= require('lodash')

async function getData(config: { shows: Array<string> }): Promise<Array<any>>{
  const responses: Array<{ data: { episodes: Array<any> } }> = await Promise.all(config.shows.map((id: string) => axios('https://tv-v2.api-fetch.website/show/' + id)))

  return _(responses).map(r => r.data.episodes).flatten().value()
}

getData({ shows: ['tt4179452'] })
  .then(l => l.filter((i: {season: number}) => i.season == 2))
  .then(l => l.sort((a: { episode: number }, b: { episode: number }) => a.episode - b.episode))
  .then(console.log)

module.exports = getData