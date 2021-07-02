'use strict';
class ServerlessPlugin {
  constructor(serverless) {
    this.serverless = serverless;
    this.provider = this.serverless.getProvider('aws');
    this.entity = 'RestAPI Automatic Deployment';
    this.hooks = { 'after:deploy:deploy': this.postDeploy.bind(this) };
  }
  postDeploy() {
    const stageName = this.serverless.service.provider.stage;
    const restApiName = `${this.serverless.service.service}-${stageName}`;
    return this.provider
      .request('APIGateway', 'getRestApis', { limit: 500 })
      .then(({ items: restApis }) =>
        restApis.find((restApi) => restApi.name === restApiName)
      )
      .then(({ id: restApiId }) => {
        this.serverless.cli.log(
          `DEPLOY_IN_PROGRESS - ${JSON.stringify(
            { restApiId, stageName, restApiName },
            null,
            4
          )}`,
          this.entity,
          { color: 'green' }
        );
        return this.provider.request('APIGateway', 'createDeployment', {
          restApiId,
          stageName,
        });
      })
      .then(() =>
        this.serverless.cli.log('DEPLOY_COMPLETE', this.entity, {
          color: 'green',
        })
      );
  }
}
module.exports = ServerlessPlugin;
