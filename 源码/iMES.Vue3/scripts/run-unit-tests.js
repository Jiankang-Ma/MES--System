const { spawnSync } = require('child_process')

const nodeMajor = Number.parseInt(process.versions.node.split('.')[0], 10)
const env = { ...process.env }
const legacyProvider = '--openssl-legacy-provider'

// Vue CLI 4 uses an older Webpack release. Node.js 17+ requires this compatibility
// provider until the frontend build toolchain is upgraded.
if (nodeMajor >= 17 && !(env.NODE_OPTIONS || '').includes(legacyProvider)) {
  env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} ${legacyProvider}`.trim()
}

const cli = require.resolve('@vue/cli-service/bin/vue-cli-service.js')
const result = spawnSync(process.execPath, [cli, 'test:unit', ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env,
  stdio: 'inherit'
})

if (result.error) throw result.error
process.exitCode = typeof result.status === 'number' ? result.status : 1
