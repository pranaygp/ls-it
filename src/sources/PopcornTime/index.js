// @flow
const Rx = require('rx')
const axios = require('axios')
const _ = require('lodash')

const event = require('../event')

// const INTERVAL: number = 1000 * 60 * 60  * 1// 1 hour TODO: Move to config
const INTERVAL: number = 1000 * 60 * 2 // 2 minutes

const Source$ = Rx.Observable
  .interval(INTERVAL)
  .exhaustMap(Promise.all(['tt4179452', 'tt3530232', 'tt2575988'].map((id: string) => axios('https://tv-v2.api-fetch.website/show/' + id))))
  .map(resps => resps.map(resp => resp.data))
  .map(resps => resps.map(show => show.episodes.map(episode => Object.assign({}, episode, {title: show.title}))))
  .map(showEpisodes => _.flatten(showEpisodes))
  .map(([a, b]) => _.differenceBy(b, a, 'tvdb_id'))
  .do(console.log)
  .flatMap(episodes => episodes)
  .map(event.bind({}, "popcorn-time"))
  .publish()
  .refCount()
  

Source$
  .subscribe(ep => console.log(`${ep.title} S${ep.season}E${ep.episode}`))

module.exports = Source$