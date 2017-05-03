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
    case "github":
      const { issue: { title: issueTitle, url: issueURL }, respository: { name: repoName } } = event.payload
      const item = `${repoName} - Issue: <a href="${issueURL}">${issueTitle}</a>`
      if(_.find(list, ['item', item]))
        return list
      return list.concat([{ _id: uuid(), item}])
    default:
      return list
  }
}