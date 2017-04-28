// @flow
const Rx = require('rx')
const _ = require('lodash')

const PopcornTime = require('../../sources/PopcornTime')

const INTERVAL: number = 1000 * 60 * 60 // 1 hour
// const INTERVAL: number = 1000 * 5 // 5 seconds

// every INTERVAL seconds, check the source for inputs, diff the incoming inputs with a stored previous inputs array, update that array and then only emit events that had atleast 1 "diffed" input
let lastCheckedEpisodes = [];
const source = Rx.Observable
      .interval(INTERVAL)
      .exhaustMap(() => PopcornTime({ shows: ['tt4179452', 'tt3530232', 'tt2575988'] }))
      .map(episodes => _.differenceBy(episodes, lastCheckedEpisodes, 'tvdb_id'))
      .do(episodes => lastCheckedEpisodes = lastCheckedEpisodes.concat(episodes))
      .filter(episodes => episodes.length)
      .skip(1)              // comment if you want the initial list of events 

// source
//   .map(episodes => episodes.map(e => e.title))
//   .subscribe(console.log)

module.exports = source