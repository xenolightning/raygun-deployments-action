const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);
const {run, outputs} = require('../src/index');
const core = require('@actions/core');

const testDeploymentIdentifier = 'abc123';

// mock the @actions/core module
jest.mock('@actions/core', () => ({
  getInput: jest.fn().mockImplementation((inputName) => mockValues[inputName] || ''),
  setFailed: jest.fn(),
  setOutput: jest.fn()
}));

let mockValues;

describe('Raygun Deployments Action', () => {
  beforeEach(() => {

    mockValues = {
      'api-key': 'test_key',
      'personal-access-token': 'test_token',
      'version': 'test_version',
      'owner-name': 'test_owner',
      'email-address': 'test_email',
      'comment': 'test_comment',
    };

    mockAxios.onPost().reply(200, { identifier: testDeploymentIdentifier });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  test('includes version in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);

    expect(postedData.version).toBe('test_version');
    expect(core.setOutput).toHaveBeenCalledWith(outputs.deploymentId, testDeploymentIdentifier);
  });

  test('includes ownerName in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);

    expect(postedData.ownerName).toBe('test_owner');
    expect(core.setOutput).toHaveBeenCalledWith(outputs.deploymentId, testDeploymentIdentifier);
  });

  test('includes emailAddress in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);

    expect(postedData.emailAddress).toBe('test_email');
    expect(core.setOutput).toHaveBeenCalledWith(outputs.deploymentId, testDeploymentIdentifier);
  });

  test('includes comment in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);

    expect(postedData.comment).toBe('test_comment');
    expect(core.setOutput).toHaveBeenCalledWith(outputs.deploymentId, testDeploymentIdentifier);
  });

  test('includes scmIdentifier in post body', async () => {
    process.env.GITHUB_SHA = '1234';

    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);

    expect(postedData.scmIdentifier).toBe('1234');
    expect(core.setOutput).toHaveBeenCalledWith(outputs.deploymentId, testDeploymentIdentifier);
  });

  test('includes scmType in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);

    expect(postedData.scmType).toBe('GitHub');
    expect(core.setOutput).toHaveBeenCalledWith(outputs.deploymentId, testDeploymentIdentifier);
  });

  test('fails if version is not provided', async () => {
    mockValues['version'] = undefined;

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('Version must not be empty');
    expect(core.setOutput).not.toHaveBeenCalled();
  });

  test('includes token in headers', async () => {
    await run();

    expect(mockAxios.history.post[0].headers['Authorization']).toBe('Bearer test_token');
    expect(core.setOutput).toHaveBeenCalledWith(outputs.deploymentId, testDeploymentIdentifier);
  });
});
