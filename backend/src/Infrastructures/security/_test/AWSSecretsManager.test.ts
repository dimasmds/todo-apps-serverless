import AWSSecretsManager from '../AWSSecretsManager';

// TODO: Skip this test if AWS is not configured
describe('AWSSecretManager', () => {
  const awsSecretManager = new AWSSecretsManager();

  describe('getSecret', () => {
    it('should return a secret', async () => {
      const secret = await awsSecretManager.getSecret('testSecret', 'testField');
      expect(secret).toBe('Test field');
    });
  });
});
