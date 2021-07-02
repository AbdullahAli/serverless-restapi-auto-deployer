const pluginEntity = require('./package.json').description;

class ServerlessPlugin {
  constructor(serverless) {
    this.serverless = serverless;
    this.provider = this.serverless.getProvider('aws');
    this.hooks = { 'after:deploy:deploy': this.postDeploy.bind(this) };
  }
  async postDeploy() {
    const stageName = this.serverless.service.provider.stage;
    const restApiName = `${this.serverless.service.service}-${stageName}`;
    const { items: restApis } = await this.provider.request(
      'APIGateway',
      'getRestApis',
      { limit: 500 }
    );
    const { id: restApiId } = restApis.find(
      (restApi) => restApi.name === restApiName
    );
    this.serverless.cli.log(
      `DEPLOY_IN_PROGRESS - ${JSON.stringify(
        { restApiId, stageName, restApiName },
        null,
        4
      )}`,
      pluginEntity,
      { color: 'green' }
    );
    await this.provider.request('APIGateway', 'createDeployment', {
      restApiId,
      stageName,
    });
    this.serverless.cli.log('DEPLOY_COMPLETE', pluginEntity, {
      color: 'green',
    });
  }
}
module.exports = ServerlessPlugin;
