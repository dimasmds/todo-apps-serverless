import dotenv from 'dotenv';

dotenv.config();

const config = {
  bucket: {
    attachment: {
      name: process.env.ATTACHMENT_BUCKET_NAME,
    },
  },
};

export default config;
