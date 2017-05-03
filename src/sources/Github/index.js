const event = require('../event')
const Webhooks$ = require('../Webhooks')

const Github$ = Webhooks$
  .pluck('payload')
  .filter(x => x.alias === "github")
  .pluck('data')
  .filter(data => data.issue)
  .map(event.bind({}, "github"))

module.exports = Github$