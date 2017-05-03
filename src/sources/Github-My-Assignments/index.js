const event = require('../event')
const Webhooks$ = require('../Webhooks')

const GithubMyAssignments$ = Webhooks$
  .pluck('payload')
  .filter(x => x.alias === "github-unimp")
  .pluck('data')
  .filter(data => data.issue)
  .filter(data => data.issue.asignee === "pranaygp")
  .map(event.bind({}, "github"))

module.exports = GithubMyAssignments$