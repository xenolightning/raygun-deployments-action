# Archived & Read-only

Active development for this project has been transferred to Raygun. This repository is now archived and read-only.

You can follow the official development and updates at [MindscapeHQ/raygun-deployments-action](https://github.com/MindscapeHQ/raygun-deployments-action)

<br/><br/><br/><br/><br/><br/><br/><br/>



# Raygun Deployments GitHub Action

This GitHub Action is designed to interface with [Raygun Deployment Tracking](https://raygun.com/documentation/product-guides/deployment-tracking/overview/).

By using this action, you will be able to automatically track deployments of your application and associate error reports with the source code of the corresponding version. This means you will get more contextual information about errors, which helps in quicker debugging and problem resolution.

## Prerequisites

1. A Raygun account
2. An API Key from your Raygun application, which should be added to your repository secrets
3. An [Personal Access Token](https://raygun.com/documentation/accounts-billing/your-settings/#personal-access-tokens) with the `deployments:write` scope, which should be added to your repository secrets

## Usage

To use this action, include it in your GitHub workflow file:

```yaml
- name: Run Raygun Deployment Action
  uses: xenolightning/raygun-deployments-action@v1
  with:
    personal-access-token: ${{ secrets.RAYGUN_PAT }}
    api-key: ${{ secrets.RAYGUN_API_KEY }}
    version: '1.0.0'
    ownerName: 'Your Name'
    emailAddress: 'your-email@domain.com'
    comment: 'Deployment comment'
```

## Inputs

This action accepts the following inputs:

| Input | Description | Required | Default |
| ----- | ----------- | -------- | ------- |
| `personal-access-token` | Your Raygun Personal Access Token. This should be stored in your repository secrets. | Yes | N/A |
| `api-key` | Your Raygun API Key. This should be stored in your repository secrets. | Yes | N/A |
| `version` | The version of the software being deployed. | Yes | N/A |
| `owner-name` | The name of the person or entity responsible for the deployment. | No | Commit author's name |
| `email-address` | The email address of the person or entity responsible for the deployment. | No | Commit author's email |
| `comment` | An optional comment about the deployment. | No | Empty string |

## Outputs

| Output | Description |
| ----- | ----------- |
| `deploymentId` | The unique identifier for the newly created deployment |


## Example

Here's an example of a step that uses this action in a workflow that runs on every push to the `main` branch:

```yaml
on:
  push:
    branches: 
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Raygun Deployment Action
        id: raygun_deployment
        uses: xenolightning/raygun-deployments-action@v1
        with:
          personal-access-token: ${{ secrets.RAYGUN_PAT }}
          api-key: ${{ secrets.RAYGUN_API_KEY }}
          version: '1.0.0'
          ownerName: 'Your Name'
          emailAddress: 'your-email@domain.com'
          comment: 'Deployment comment'
      - run: echo "Deployment [${{ steps.raygun_deployment.outputs.deploymentId }}] was created successfully 🎉"
```

In this example, the `personal-access-token` and `api-key` are stored as secrets in the repository, the `version` is your internal version, and the `ownerName` and `emailAddress` are hard-coded. Adjust these inputs as needed for your use case.

---

Remember to replace `your-email@domain.com`, and `'Your Name'` with your actual GitHub username, email, and name. Update the `v1.0.0` version tag as necessary. 

The examples in the README show how to pass input parameters, but they're just examples. The real values should be determined based on the context and actual requirements of the workflow where this action is used.


## Building from source

Restore packages
```
yarn install
```

Run tests
```
npm run test
```

Run build script & generate dist output
```
npm run build
```
