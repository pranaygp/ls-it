// @flow
module.exports = (list: Array<string> = [], event: { type: string, payload: any } ): Array<string> => {
  switch(event.type){
    case "test-webhook":
      return list.concat([event.payload.item])
    case "popcorn-time":
      const { title: epTitle, season, episode } = event.payload
      return list.concat([`${epTitle} S${season}E${episode}`])
    case "ls-it-github":
      const { title: issueTitle } = event.payload.issue
      return list.concat([`Ls It Github - Issue: ${issueTitle}`])
    default:
      return list
  }
}