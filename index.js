'use strict';

class ServerlessPlugin {
  constructor(serverless) {
    this.serverless = serverless;
    this.provider = this.serverless.getProvider('aws');
    this.pluginName = 'APIGateway Auto Deployer';

    this.hooks = {
      'after:deploy:deploy': this.postDeploy.bind(this),
    };
  }

  postDeploy() {
    const stageName =
      this.serverless.variables.options.stage ||
      this.serverless.service.defaults.stage;

    this.serverless.cli.log('STARTING_DEPLOY', this.pluginName);

    console.log(this.serverless.service);

    // const restApis = await this.provider.request('APIGateway', 'getRestApis');

    // return this.provider
    //   .request('APIGateway', 'getRestApis')
    //   .then(({ items: restApis }) => restApis.filter(restApi => restApi.name === ));

    // this.serverless.cli.log(
    //   `DEPLOY_IN_PROGRESS - { restApiId: ${restApiId}, stageName: ${stageName} }`,
    //   this.pluginName,
    //   { color: 'green' }
    // );

    // await this.provider.request('APIGateway', 'createDeployment', {
    //   restApiId,
    //   stageName,
    // });

    // this.serverless.cli.log('DEPLOY_COMPLETE', this.pluginName, {
    //   color: 'green',
    // });
  }
}

module.exports = ServerlessPlugin;
