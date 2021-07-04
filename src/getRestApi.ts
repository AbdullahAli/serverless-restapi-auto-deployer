import { APIGateway, paginateGetRestApis } from '@aws-sdk/client-api-gateway';

export const getRestApiId = async (restApiName: string, region: string) => {
  const paginator = paginateGetRestApis(
    { client: new APIGateway({ region }) },
    { limit: 500 }
  );

  for await (const { items: restApis } of paginator) {
    const restApiId = restApis?.find(({ name }) => name === restApiName)?.id;
    if (restApiId) return restApiId;
  }

  throw new Error(
    `NO_RESTAPI_FOUND - ${JSON.stringify({ restApiName, region })}`
  );
};
