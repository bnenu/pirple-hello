const { isType, safeIs, Maybe } = require('./helpers')
const { safe } = Maybe

// type Environment = {
//  httpPort = Number,
//  httpsPort = Number,
//  envName = String,
//  hashSecret = String
// }

const environments = {
  development: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'development',
    hashSecret: 's0m3S3cr3tH@sh'
  },
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashSecret: 's0m3S3cr3tH@sh'
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashSecret: 's0m3S3cr3tH@sh'
  }
}

// currentEnv :: String -> Environment
const currentEnv =
  safe(isType('string'))(process.env.NODE_ENV)
    .map(x => x.toLowerCase())
    .chain(env => safe(isType('object'))(environments[env]))
    .option(environments.staging)

module.exports = currentEnv
