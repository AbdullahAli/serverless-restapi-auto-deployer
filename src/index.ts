import Serverless from 'serverless';
import Plugin from 'serverless/classes/Plugin';
import { getRestApiId } from './getRestApi';
import { deployRestApi } from './deployRestApi';

class ServerlessRestapiAutoDeployer implements Plugin {
  serverless: Serverless;
  hooks: Plugin.Hooks;

  constructor(serverless: Serverless) {
    this.serverless = serverless;
    this.hooks = { 'after:deploy:deploy': this.postDeploy };
  }

  postDeploy = async () => {
    const provider = this.serverless.getProvider('aws');
    const region = provider.getRegion();
    const stageName = provider.getStage();
    const restApiName = provider.naming.getApiGatewayName();

    const restApiId = await getRestApiId(restApiName, region);

    this.serverless.cli.log(
      `[RestApi Auto Deployer]: starting deploy ${JSON.stringify({
        restApiId,
        stageName,
        restApiName,
      })}`
    );
    await deployRestApi(restApiId, stageName, region);
    this.serverless.cli.log('[RestApi Auto Deployer]: deploy complete');
  };
}

module.exports = ServerlessRestapiAutoDeployer;
