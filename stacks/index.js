import { LambdaStack } from './Lambda'

export default app => {
  app.setDefaultFunctionProps({
    timeout: 30,
    runtime: 'nodejs12.x'
  })

  new LambdaStack(app, 'stack', {
    stage: app.stage,
    region: app.region,
    stackName: `${app.stage}-${app.name}`
  })
}
