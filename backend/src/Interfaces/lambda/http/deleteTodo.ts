import middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { cors } from 'middy/middlewares';
import { getTokenFromAuthHeader } from '../../../Commons/utils';
import container from '../../../Infrastructures/container';
import TodoDeletionUseCase from '../../../Applications/use_cases/TodoDeletionUseCase';
import DomainErrorToHTTPTranslator from '../../../Commons/exceptions/DomainErrorToHTTPTranslator';
import ClientError from '../../../Commons/exceptions/ClientError';

const todoDeletion = container.getInstance(TodoDeletionUseCase.name) as TodoDeletionUseCase;

export const handler = middy(
  async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try {
      const token = getTokenFromAuthHeader(event.headers.Authorization);
      const { todoId } = event.pathParameters;

      await todoDeletion.execute({ todoId, token });

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
