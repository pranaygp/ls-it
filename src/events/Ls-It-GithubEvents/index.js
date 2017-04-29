const GlobalWebhooksSource$ = require('../../_webhooks')

const TestWebhooksSource$ = GlobalWebhooksSource$
  .asObservable()
  .filter(x => x.alias === "ls-it-github")
  .pluck('data')

module.exports = TestWebhooksSource$