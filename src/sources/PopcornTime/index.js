// @flow
const Rx = require('rxjs/Rx')
const axios = require('axios')
const _ = require('lodash')

const event = require('../event')

const INTERVAL = process.env.NODE_ENV === "production" ? 1000 * 60 * 60 : 1000 * 1 // 1 hour or 1 second

const Source$ = Rx.Observable
  .interval(INTERVAL)
  .exhaustMap(() => Promise.all(['tt4179452', 'tt3530232', 'tt2575988'].map((id: string) => axios('https://tv-v2.api-fetch.website/show/' + id))))
  .map(resps => resps.map(resp => resp.data))
  .map(resps => resps.map(show => show.episodes.map(episode => Object.assign({}, episode, {title: show.title}))))
  .map(showEpisodes => _.flatten(showEpisodes))
  .pairwise()
  .map(([a, b]) => _.differenceBy(b, a, 'tvdb_id'))
  .flatMap(episodes => episodes)
  .map(event.bind({}, "popcorn-time"))
  .publishReplay()
  .refCount()

module.exports = Source$