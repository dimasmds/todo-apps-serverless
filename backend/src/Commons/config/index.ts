import dotenv from 'dotenv';

dotenv.config();

const config = {
  bucket: {
    attachment: {
      name: process.env.ATTACHMENT_BUCKET_NAME,
    },
  },
  secret: {
    secretId: process.env.SECRET_ID,
    field: {
      auth0: process.env.AUTH_0_SECRET_FIELD,
    },
  },
  dynamodb: {
    todos: {
      name: process.env.TODOS_TABLE,
    },
  },
  awsSdk: {
    region: process.env.AWS_REGION,
  },
};

export default config;
