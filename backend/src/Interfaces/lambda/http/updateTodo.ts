import middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { cors } from 'middy/middlewares';
import DomainErrorToHTTPTranslator from '../../../Commons/exceptions/DomainErrorToHTTPTranslator';
import ClientError from '../../../Commons/exceptions/ClientError';
import { getTokenFromAuthHeader } from '../../../Commons/utils';
import container from '../../../Infrastructures/container';
import TodoUpdateUseCase from '../../../Applications/use_cases/TodoUpdateUseCase';

const todoUpdate = container.getInstance(TodoUpdateUseCase.name) as TodoUpdateUseCase;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const token = getTokenFromAuthHeader(event.headers.Authorization);
      const { todoId } = event.pathParameters;
      const requestPayload = JSON.parse(event.body);

      await todoUpdate.execute({
        ...requestPayload,
        todoId,
        token,
      });

      return {
        statusCode: 204,
        body: '',
      };
    } catch (error: any) {
      const translatedError = DomainErrorToHTTPTranslator.translate(error);

      if (translatedError instanceof ClientError) {
        return {
          statusCode: translatedError.statusCode,
          body: JSON.stringify({
            message: translatedError.message,
          }),
        };
      }

      console.error(translatedError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'something wrong with our service',
        }),
      };
    }
  },
);

handler.use(
  cors({
    credentials: true,
  }),
);
