const event = require('../event')
const Webhooks$ = require('../Webhooks')

const LsItGithub$ = Webhooks$
  .pluck('payload')
  .filter(x => x.alias === "ls-it-github")
  .pluck('data')
  .map(event.bind({}, "ls-it-github"))

module.exports = LsItGithub$