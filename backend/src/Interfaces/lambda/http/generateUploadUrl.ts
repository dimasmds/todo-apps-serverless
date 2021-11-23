import middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = middy(
  async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => ({
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World',
      input: event,
    }),
  }),
);
