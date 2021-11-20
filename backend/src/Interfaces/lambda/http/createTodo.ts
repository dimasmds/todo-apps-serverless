import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO : Implement creating a new TODO item
  console.log('');
  return { statusCode: 201, body: JSON.stringify({ message: 'Create TODO item' }) };
};
