const event = require('../event')
const Webhooks$ = require('../Webhooks')

const Github$ = Webhooks$
  .pluck('payload')
  .filter(x => x.alias === "github")
  .pluck('data')
  .filter(data => (data.issue && data.issue.user.login !== "pranaygp") || (data.pull_request && data.pull_request.user.login !== "pranaygp"))
  .map(event.bind({}, "github"))

module.exports = Github$