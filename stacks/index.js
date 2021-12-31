import { LambdaStack } from './Lambda'

export default app => {
  app.setDefaultFunctionProps({
    timeout: 30,
    runtime: 'nodejs12.x'
  })

  new LambdaStack(app, 'stack', {
    stage: app.stage,
    stackName: `${app.stage}-${app.name}`
  })
}
