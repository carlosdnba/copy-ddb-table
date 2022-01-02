# Copy DynamoDB Table

This project is an AWS Lambda to replicate items from a DynamoDB table to another. It uses very simple API calls through the AWS SDK v3 DynamoDB package. It also supports cross-zone in the AWS regions.

## Use case

This Lambda may be much useful when you want to rename a table or replicate it to another region. However, it is just a Lambda to scan all the items from an origin table and write them to a destination one. It does not create a new table, so you will need to create it with the required primary and sort keys before running the Lambda.
