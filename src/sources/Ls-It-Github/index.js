const event = require('../event')
const Webhooks$ = require('../Webhooks')

const LsItGithub$ = Webhooks$
  .pluck('payload')
  .filter(x => x.alias === "ls-it-github")
  .pluck('data')
  .filter(data => data.issue)
  .map(event.bind({}, "ls-it-github"))

module.exports = LsItGithub$