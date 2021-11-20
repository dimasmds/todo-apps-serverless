import InvariantError from '../InvariantError';

describe('InvariantError', () => {
  it('should create InvariantError correctly', () => {
    const error = new InvariantError('message');
    expect(error.statusCode).toEqual(400);
    expect(error.message).toEqual('message');
    expect(error.name).toEqual('InvariantError');
    expect(error.stack).toBeDefined();
  });
});
