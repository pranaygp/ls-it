// @flow
const uuid = require('uuid/v4')
const _ = require('lodash')
module.exports = (list: Array<{_id: string, item: string}> = [], event: { type: string, payload: any } ): Array<{_id: string, item: string}> => {
  switch(event.type){
    case "manual-webhook":
      switch(event.payload.action){
        case "add":
          return list.concat([{ _id: uuid(), item: event.payload.item }])
        case "remove":
          return _.reject(list, ['_id', event.payload.id])
        default:
          return list
      }
    case "popcorn-time":
      const { title: epTitle, season, episode } = event.payload
      return list.concat([{ _id: uuid(), item: `${epTitle} S${season}E${episode}` }])
    case "ls-it-github":
      const { title: issueTitle } = event.payload.issue
      return list.concat([{ _id: uuid(), item: `Ls It Github - Issue: ${issueTitle}` }])
    default:
      return list
  }
}