import { SESClient, SESClientConfig } from "@aws-sdk/client-ses";

const SES_CONFIG: SESClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
};

export const sesClient = new SESClient(SES_CONFIG);
