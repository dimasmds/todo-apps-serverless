import NotFoundError from '../NotFoundError';

describe('NotFoundError', () => {
  it('should create NotFoundError correctly', () => {
    const error = new NotFoundError('test');
    expect(error.statusCode).toEqual(404);
    expect(error.message).toEqual('test');
    expect(error.name).toEqual('NotFoundError');
    expect(error.stack).toBeDefined();
  });
});
