const event = require('../event')
const Webhooks$ = require('../Webhooks')

const ManualWebhook$ = Webhooks$
  .pluck('payload')
  .filter(x => x.alias === "manual")
  .pluck('data')
  .map(event.bind({}, "manual-webhook"))

module.exports = ManualWebhook$