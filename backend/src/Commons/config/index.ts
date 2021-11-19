import dotenv from 'dotenv';

dotenv.config();

const config = {
  bucket: {
    attachment: {
      name: process.env.ATTACHMENT_BUCKET_NAME,
    },
  },
  auth: {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET,
    },
  },
};

export default config;
