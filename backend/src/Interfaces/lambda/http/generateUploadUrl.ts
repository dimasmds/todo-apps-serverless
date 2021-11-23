import middy from 'middy';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { cors } from 'middy/middlewares';
import { getTokenFromAuthHeader } from '../../../Commons/utils';
import DomainErrorToHTTPTranslator from '../../../Commons/exceptions/DomainErrorToHTTPTranslator';
import ClientError from '../../../Commons/exceptions/ClientError';
import UploadAttachmentUseCase from '../../../Applications/use_cases/UploadAttachmentUseCase';
import container from '../../../Infrastructures/container';

const uploadAttachmentUseCase = <UploadAttachmentUseCase>
  container.getInstance(UploadAttachmentUseCase.name);

export const handler = middy(
  async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try {
      const { todoId } = event.pathParameters;
      const token = getTokenFromAuthHeader(event.headers.Authorization);
      const uploadUrl = await uploadAttachmentUseCase.execute({
        todoId,
        token,
      });

      return {
        statusCode: 201,
        body: JSON.stringify({ uploadUrl }),
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
