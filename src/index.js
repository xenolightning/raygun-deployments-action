const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

module.exports = run;

const raygunBaseUri = 'https://api.raygun.com';
const scmType = "GitHub";
const outputs = {
    'deploymentId': 'deploymentId'
}

async function run() {
    try {
        const apiKey = core.getInput('api-key');
        const token = core.getInput('personal-access-token');
        const version = core.getInput('version');
        const ownerName = core.getInput('owner-name') || github.context.actor;
        const emailAddress = core.getInput('email-address') || `${github.context.actor}@users.noreply.github.com`;
        const comment = core.getInput('comment') || "";
        const commitSha = process.env.GITHUB_SHA;
        const deployedAt = new Date().toISOString();

        if (!version || version.length === 0) {
            core.setFailed(`Version must not be empty`);
            return;
        }

        const raygunDeployment = {
            version: version,
            ownerName: ownerName,
            emailAddress: emailAddress,
            comment: comment,
            scmIdentifier: commitSha,
            scmType: scmType,
            deployedAt: deployedAt
        };

        const axiosConfig = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        console.log("Deploying:", raygunDeployment);

        const response = await axios.post(
            `${raygunBaseUri}/v3/applications/api-key/${apiKey}/deployments`,
            raygunDeployment,
            axiosConfig
        );

        console.log('Deployment successful', response.data);

        core.setOutput(outputs.deploymentId, response.data.identifier);
    } catch (error) {
        core.setFailed(`Action failed with error ${error}`);
    }
}

if (require.main === module) {
    run();
}

module.exports = {
    run,
    outputs
};