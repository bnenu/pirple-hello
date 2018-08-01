const handlers = require('./handlers')

// routing
module.exports = {
  'hello': handlers.hello,
  'notFound': handlers.notFound
}
