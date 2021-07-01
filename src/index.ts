import Serverless from 'serverless';
import Plugin from 'serverless/classes/Plugin';
import { description as pluginEntity } from '../package.json';
import { getRestApiId } from './getRestApi';
import { deployRestApi } from './deployRestApi';

class ServerlessRestapiAutoDeployer implements Plugin {
  serverless: Serverless;
  hooks: Plugin.Hooks;

  constructor(serverless: Serverless) {
    this.serverless = serverless;
    this.hooks = { 'after:deploy:deploy': this.postDeploy.bind(this) };
  }

  async postDeploy() {
    const region = this.serverless.getProvider('aws').getRegion();
    const stageName = this.serverless.getProvider('aws').getStage();
    const restApiName =
      this.serverless.service.provider.compiledCloudFormationTemplate.Resources
        .ApiGatewayRestApi.Properties.Name;
    const restApiId = await getRestApiId(restApiName, region);

    if (!restApiId) {
      throw new Error(
        `NO_RESTAPI_FOUND - ${JSON.stringify({ restApiName, region })}`
      );
    }

    this.serverless.cli.log(
      `DEPLOY_IN_PROGRESS - ${JSON.stringify(
        {
          restApiId,
          stageName,
          restApiName,
        },
        null,
        4
      )}`,
      // @ts-ignore - Serverless plugin has incorrect interfaces
      pluginEntity,
      { color: 'green' }
    );

    await deployRestApi(restApiId, stageName, region);

    //@ts-ignore - Serverless plugin has incorrect interfaces
    this.serverless.cli.log('DEPLOY_COMPLETE', pluginEntity, {
      color: 'green',
    });
  }
}

module.exports = ServerlessRestapiAutoDeployer;
