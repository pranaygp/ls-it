// @flow
const Rx = require('rx')
const _ = require('lodash')

const PopcornTime = require('../../sources/PopcornTime')

// const INTERVAL: number = 1000 * 60 * 60 // 1 hour TODO: Move to config
const INTERVAL: number = 1000 * 5 // 5 seconds

// every INTERVAL seconds, check the source for inputs, diff the incoming inputs with the last received inputs and then only emit events that had atleast 1 "diffed" input
const source$ = Rx.Observable
      .interval(INTERVAL)
      .exhaustMap(() => PopcornTime({ shows: ['tt4179452', 'tt3530232', 'tt2575988'] })) // TODO: Don't hardcode. Move to config, and then to input
      .pairwise()
      .map(([a, b]) => _.differenceBy(b, a, 'tvdb_id'))
      .filter(episodes => episodes.length)

// source$
//   .map(episodes => episodes.map(e => e.title))
//   .subscribe(console.log)

module.exports = source$