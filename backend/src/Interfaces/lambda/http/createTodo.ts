import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import { getTokenFromAuthHeader } from '../../../Commons/utils';
import container from '../../../Infrastructures/container';
import TodoCreationUseCase from '../../../Applications/use_cases/TodoCreationUseCase';
import DomainErrorToHTTPTranslator from '../../../Commons/exceptions/DomainErrorToHTTPTranslator';
import ClientError from '../../../Commons/exceptions/ClientError';

const todoCreationUseCase = <TodoCreationUseCase> container.getInstance(TodoCreationUseCase.name);

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const requestPayload = JSON.parse(event.body);
      const accessToken = getTokenFromAuthHeader(event.headers.Authorization);

      const item = await todoCreationUseCase.execute({
        ...requestPayload,
        accessToken,
      });

      return {
        statusCode: 201,
        body: JSON.stringify({
          item,
        }),
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
