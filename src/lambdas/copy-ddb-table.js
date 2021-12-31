import chunk from 'lodash/chunk'
import { DynamoDBClient, ScanCommand, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'

const validateParams = (origin, destination) => {
  const solutionExample = JSON.stringify({
    origin: {
      tableName: 'origin-table-name',
      region: 'us-east-1'
    },
    destination: {
      tableName: 'destination-table-name',
      region: 'us-east-1'
    }
  })

  const requiredParams = ['tableName', 'region']
  const missingParams = []
  requiredParams.forEach(param => {
    if (!origin[param]) missingParams.push(`origin.${param}`)
    if (!destination[param]) missingParams.push(`destination.${param}`)
  })

  if (missingParams.length) {
    throw new Error(`Missing required params: ${missingParams.join(', ')}.\nYour request should look like this: ${solutionExample}`)
  }
}

const scanData = async (ddbClient, tableName) => {
  let data = {}
  const response = []
  do {
    data = await ddbClient.send(
      new ScanCommand({
        TableName: tableName,
        Limit: 300,
        ...(data.LastEvaluatedKey && {
          ExclusiveStartKey: data.LastEvaluatedKey
        })
      })
    )
    response.push(...data.Items)
  } while (data.LastEvaluatedKey)
  return response
}

export const main = async event => {
  // table names for both origin and destination tables
  const { origin, destination } = event
  validateParams(origin, destination)

  const OriginDdbClient = new DynamoDBClient({ region: origin.region })
  const DestinationDdbClient = new DynamoDBClient({ region: destination.region })

  const originData = await scanData(OriginDdbClient, origin.tableName)

  // Chunking the data to avoid exceeding the maximum request size of 5MB or 25 items
  const chunkedOriginData = chunk(originData, 20)

  // Building array of BatchWriteItemCommand objects
  const BachesArr = chunkedOriginData.map(chu => ({
    RequestItems: {
      [destination.tableName]: chu.map(item => ({
        PutRequest: {
          Item: item
        }
      }))
    }
  }))

  const promises = BachesArr.map(Batch => DestinationDdbClient.send(new BatchWriteItemCommand(Batch)))
  await Promise.all(promises)
}
