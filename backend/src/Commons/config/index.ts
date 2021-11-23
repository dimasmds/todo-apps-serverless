import dotenv from 'dotenv';

dotenv.config();

const config = {
  secret: {
    secretId: process.env.SECRET_ID,
    field: {
      auth0: process.env.AUTH_0_SECRET_FIELD,
    },
  },
  dynamodb: {
    todos: {
      name: process.env.TODOS_TABLE,
      userIndex: process.env.TODOS_BY_USER_INDEX,
    },
  },
  awsSdk: {
    region: process.env.AWS_REGION,
  },
  s3: {
    attachment: {
      bucketName: process.env.ATTACHMENTS_BUCKET_NAME,
      signedUrlExpiration: process.env.SIGNED_URL_EXPIRATION,
    },
  },
};

export default config;
