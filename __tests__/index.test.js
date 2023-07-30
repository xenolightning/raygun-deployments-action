const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);
const run = require('../src/index');
const core = require('@actions/core');

// mock the @actions/core module
const mockValues = {
  'api-key': 'test_key',
  'personal-access-token': 'test_token',
  'version': 'test_version',
  'owner-name': 'test_owner',
  'email-address': 'test_email',
  'comment': 'test_comment',
};

jest.mock('@actions/core', () => ({
  getInput: jest.fn().mockImplementation((inputName) => mockValues[inputName] || ''),
  setFailed: jest.fn(),
}));

describe('Raygun Deployments Action', () => {
  beforeEach(() => {
    mockAxios.onPost().reply(200, {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  test('includes version in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);
    expect(postedData.version).toBe('test_version');
  });

  test('includes ownerName in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);
    expect(postedData.ownerName).toBe('test_owner');
  });

  test('includes emailAddress in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);
    expect(postedData.emailAddress).toBe('test_email');
  });

  test('includes comment in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);
    expect(postedData.comment).toBe('test_comment');
  });

  test('includes scmIdentifier in post body', async () => {
    process.env.GITHUB_SHA = '1234';

    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);
    expect(postedData.scmIdentifier).toBe('1234');
  });

  test('includes scmType in post body', async () => {
    await run();

    const postedData = JSON.parse(mockAxios.history.post[0].data);
    expect(postedData.scmType).toBe('GitHub');
  });

  test('fails if version is not provided', async () => {
    mockValues['version'] = undefined;

    await run();
    expect(core.setFailed).toHaveBeenCalledWith('Version must not be empty');
  });

  test('includes token in headers', async () => {
    await run();

    expect(mockAxios.history.post[0].headers['Authorization']).toBe('Bearer test_token');
  });
});
