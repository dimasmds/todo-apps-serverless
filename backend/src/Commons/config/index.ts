import dotenv from 'dotenv';

dotenv.config();

const config = {
  bucket: {
    attachment: {
      name: process.env.ATTACHMENT_BUCKET_NAME,
    },
  },
  secret: {
    auth0: {
      secretId: process.env.AUTH_0_SECRET_ID,
      secretField: process.env.AUTH_0_SECRET_FIELD,
    },
  },
  dynamodb: {
    todos: {
      name: process.env.TODOS_TABLE,
    },
  },
};

export default config;
