import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import container from '../../../Infrastructures/container';
import SecretManager from '../../../Applications/security/SecretManager';
import JwtTokenize from '../../../Applications/tokenize/JwtTokenize';
import config from '../../../Commons/config';
import { getTokenFromAuthHeader } from '../../../Commons/utils';

const jwtTokenize = <JwtTokenize> container.getInstance('JwtTokenize');
const secretManager = <SecretManager> container.getInstance('SecretManager');

const verifyToken = async (token: string) => {
  const secret = await secretManager.getSecret(
    config.secret.secretId,
    config.secret.field.auth0,
  );

  return jwtTokenize.verify(token, secret);
};

const decodeToken = async (token: string) => jwtTokenize.decode(token);

export const handler = async (event: CustomAuthorizerEvent)
  : Promise<CustomAuthorizerResult> => {
  const token = getTokenFromAuthHeader(event.authorizationToken);
  const isVerified = await verifyToken(token);

  if (!isVerified) {
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }

  const { sub } = await decodeToken(token);

  return {
    principalId: sub,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
    },
  };
};
