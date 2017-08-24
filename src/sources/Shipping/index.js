const event = require('../event')
const Webhooks$ = require('../Webhooks')

const Shipping$ = Webhooks$
  .pluck('payload')
  .filter(x => x.alias === "shipping")
  .pluck('data')
  .map(event.bind({}, "shipping"))

module.exports = Shipping$