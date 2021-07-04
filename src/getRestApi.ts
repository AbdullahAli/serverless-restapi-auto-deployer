import { APIGateway, paginateGetRestApis } from '@aws-sdk/client-api-gateway';

export const getRestApiId = async (restApiName: string, region: string) => {
  const paginator = paginateGetRestApis(
    { client: new APIGateway({ region }) },
    { limit: 500 }
  );

  for await (const page of paginator) {
    const restApiId = page.items?.find(({ name }) => name === restApiName)?.id;
    if (restApiId) return restApiId;
  }

  throw new Error(
    `[RestApi Auto Deployer]: No RestApi found - ${JSON.stringify({
      restApiName,
      region,
    })}`
  );
};
