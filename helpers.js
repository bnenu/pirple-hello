
/*
 *
 * Pointfree helpers
 */

const tap = fn => x => {
  fn(x)

  return x
}

const log = (...x) => tap(console.log.bind(console))(...x)

const map =
  fn => x => x.map(fn)

const chain =
  fn => x => x.chain(fn)

/*
 *
 * Combinators
 */

// compose :: (a -> b) -> (b -> c) -> a -> c
const compose =
  (fn, ...rest) =>
    rest.length === 0 ? fn : (...x) => fn(compose(...rest)(...x))


// constant :: a -> b -> a
const constant =
  x => y => x

// identity :: a -> a
const identity =
  x => x

// flip :: (a -> b -> c) -> b -> a -> c
const flip =
  fn => y => x => fn(x, y)

/*
 *
 * Predicates and logic
 */

// composePreds :: [ preds ] -> x -> Boolean
const composePreds =
  (...preds) => x =>
    preds.reduce((acc, p) => acc === false ? false : p(x), true)

// isType :: String -> a -> Boolean
const isType =
  type => x => typeof x === type

// isArray :: a -> Boolean
const isArray =
  x => Array.isArray(x)

// isTrue :: Boolean -> Boolean
const isTrue =
  x => x === true ? true : false

// isFalse :: Boolean -> Boolean
const isFalse =
  x => x === false ? true : false

// not :: a -> Boolean
const not =
  x => !x

// isNotNil :: a -> Boolean
const isNotNil =
  x => (x !== undefined && x !== null)

// isNil :: a -> Boolean
const isNil =
  x => (x === undefined || x === null)

// hasMinLen :: Number -> String|Array -> Boolean
const hasMinLen =
  min => x => (isType('string')(x) || isArray(x)) ? x.length >= min : false

// safeIs :: (a -> Boolean) -> b -> a -> a|b
const safeIs =
  pred => option => x => pred(x) ? x : option

// ifElse :: pred -> ((a -> b), (a -> b)) -> a -> b
const ifElse =
  pred => f => g => x => pred(x) ? f(x) : g(x)

/*
 *
 * Monads and other stuff
 */

const isSameType = (M, x) => M['@@type'] === x['@@type']

// Poor man's ADTs

// Maybe
const Just = val => ({
  toString: () => `Just(${val})`,
  map: fn => Just(fn(val)),
  chain: fn => fn(val),
  ap: M => M.map(val),
  option: () => val,
  ['@@type']: '@@maybe'
})

const Nothing = () => ({
  toString: () => 'Nothing',
  map: () => Nothing(),
  chain: () => Nothing(),
  ap: () => Nothing(),
  option: defaultValue => defaultValue,
  ['@@type']: '@@maybe'
})

const Maybe = {
  Just: Just,
  Nothing: Nothing,
  of: val => Maybe.Just(val),
  safe: pred => val => pred(val) ? Maybe.Just(val) : Maybe.Nothing(),
  option: val => M => M.option(val),
  ['@@type']: '@@maybe'
}

// Reader
const Reader = (runWith) => ({
  runWith: runWith,
  map: fn => Reader(compose(fn, runWith)),
  chain: fn => Reader(env => fn(runWith(env)).runWith(env)),
  ap: R => Reader(env => R.map(runWith(env)).runWith(env))
})

// safeProp :: String -> {} -> Maybe a
const safeProp = key => data => prop(key)(data) ? Maybe.Just(prop(key)(data)) : Maybe.Nothing()

// prop :: String -> {} -> a
const prop = propName => obj => obj[propName]


/*
 *
 * Parsers
 */

// parseJsonToObj :: String -> { a }
const parseJsonToObj = str => {
  try {
    return JSON.parse(str)
  } catch(err) {
    return {}
  }
}

// stringify :: { a } -> String
const stringify = data => {
  try {
    return JSON.stringify(data)
  } catch(err) {
    return false
  }
}

/*
 *
 * Other helpers
 */

// objOf :: String -> a -> {}
const objOf = key => value => ({ [key]: value })

// assoc :: {} -> {} -> {}
const assoc = obj => more => Object.assign({}, obj, more)

// trim :: String -> String
const trim =
  x => isType('string')(x) ? x.trim() : x

// replace :: String -> String
const replace =
  (regExp, x) => str => str.replace(regExp, x)

// createRandomString :: Int -> String
const createRandomString = len => {
  if(isType('number')(len)) {
    const source = 'abcdefghijklmnoprstuvwqxyz0123456789'
    let str = ''

    for(let i = 1; i <= len; i++) {
      var randChar = source.charAt(Math.floor(Math.random() * source.length))

      str += randChar
    }

    return str
  }

  return false
}

module.exports = {
  Maybe, Reader,
  assoc,
  chain, compose, composePreds, constant, createRandomString,
  hasMinLen,
  identity, ifElse, isArray, isType, isTrue, isFalse, isNil, isNotNil,
  flip, log, map, not, objOf, parseJsonToObj, prop, replace,
  safeIs, safeProp, stringify, tap, trim
}
