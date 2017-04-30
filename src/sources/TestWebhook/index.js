const event = require('../event')
const Webhooks$ = require('../Webhooks')

const TestWebhook$ = Webhooks$
  .pluck('payload')
  .filter(x => x.alias === "test")
  .pluck('data')
  .map(event.bind({}, "test-webhook"))

module.exports = TestWebhook$