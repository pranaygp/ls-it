const Source$ = require('../build/sources/PopcornTime/')

test('test', () => {
  expect.assertions(3)

  return Source$
    .first()
    .toPromise()
    .then(event => {
      expect(event.type).toBe('popcorn-time')
      expect(event.payload.tvdb_id).toBe(4)
      expect(event.payload.title).toBe('Show 1')
    })
})