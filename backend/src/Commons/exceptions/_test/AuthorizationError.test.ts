import AuthorizationError from '../AuthorizationError';

describe('AuthorizationError', () => {
  it('should create AuthorizationError correctly', () => {
    const error = new AuthorizationError('test');
    expect(error.message).toBe('test');
    expect(error.name).toBe('AuthorizationError');
    expect(error.stack).toBeDefined();
    expect(error.statusCode).toBe(403);
  });
});
