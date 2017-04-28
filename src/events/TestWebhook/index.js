const GlobalWebhooksSource$ = require('../../_webhooks')

const TestWebhooksSource$ = GlobalWebhooksSource$
  .asObservable()
  .filter(x => x.alias === "test")
  .pluck('data')

module.exports = TestWebhooksSource$