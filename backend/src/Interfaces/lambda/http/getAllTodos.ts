import middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { cors } from 'middy/middlewares';
import container from '../../../Infrastructures/container';
import { getTokenFromAuthHeader } from '../../../Commons/utils';
import DomainErrorToHTTPTranslator from '../../../Commons/exceptions/DomainErrorToHTTPTranslator';
import ClientError from '../../../Commons/exceptions/ClientError';
import GetAllTodosUseCase from '../../../Applications/use_cases/GetAllTodosUseCase';

const getAllTodosUseCase = container.getInstance(GetAllTodosUseCase.name) as GetAllTodosUseCase;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const token = getTokenFromAuthHeader(event.headers.Authorization);
      const todos = await getAllTodosUseCase.execute({ token });
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: todos,
        }),
      };
    } catch (error: any) {
      console.error(error);
      const translatedError = DomainErrorToHTTPTranslator.translate(error);

      if (translatedError instanceof ClientError) {
        return {
          statusCode: translatedError.statusCode,
          body: JSON.stringify({
            message: translatedError.message,
          }),
        };
      }

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
