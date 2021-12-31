import * as sst from '@serverless-stack/resources'

export class LambdaStack extends sst.Stack {
  constructor (scope, id, props) {
    super(scope, id, props)

    const Function = new sst.Function(this, 'lambda', {
      functionName: `${props.stackName}-main`,
      handler: 'src/lambdas/copy-ddb-table.main',
      permissions: ['dynamodb:*']
    })

    this.addOutputs({
      LambdaName: Function.functionName
    })
  }
}
