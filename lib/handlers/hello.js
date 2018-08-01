//Deps
const { Maybe, safeProp, constant } = require('../../helpers')
const { safe } = Maybe

// type HTTP Method = String

// accept :: [ HTTP Method ] -> HTTP Method -> Boolean
const accept = verbs => method => verbs.indexOf(method) > -1

/*
 *
 * Hello handlers
 */

let _hello = {}

// hello :: {} -> ((Error, a) -> ()) -> ()
const hello = (data, cb) => {
  const isAccepted = accept([ 'post', 'get' ])

  const route = safeProp('method')(data)
    .chain(safe(isAccepted))
    .chain(m => safeProp(m)(_hello))
    .map(f => (data, cb) => () => f(data,  cb))
    .option(constant(() => cb(405)))

  return route(data, cb)()
}

// get :: {} -> ((Error, a) -> ()) -> ()
_hello.get = (data, cb) => cb(200, { data: 'This is what you GET!' })

// post :: {} -> ((Error, a) -> ()) -> ()
_hello.post = (data, cb) => cb(200, { data: 'Stay on your POST!' })

module.exports = hello
