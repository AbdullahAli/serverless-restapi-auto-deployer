import { APIGateway } from '@aws-sdk/client-api-gateway';

export const deployRestApi = async (
  restApiId: string,
  stageName: string,
  region: string
) => new APIGateway({ region }).createDeployment({ restApiId, stageName });
