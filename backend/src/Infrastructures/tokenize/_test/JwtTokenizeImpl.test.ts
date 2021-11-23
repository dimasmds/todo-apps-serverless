import * as jwt from 'jsonwebtoken';
import JwtTokenizeImpl from '../JwtTokenizeImpl';

// skip this test if aws is not configured
xdescribe('JwtTokenizeImpl', () => {
  const tokenize = new JwtTokenizeImpl();

  describe('verify', () => {
    it('should verify token correctly', async () => {
      // Arrange
      const token = jwt.sign({ foo: 'bar' }, 'secret');

      // Action
      const result = await tokenize.verify(token, 'secret');
      const otherResult = await tokenize.verify(token, 'otherSecret');

      // Assert
      expect(result).toEqual(true);
      expect(otherResult).toEqual(false);
    });
  });

  describe('decode', () => {
    it('should decode token correctly', async () => {
      // Arrange
      const token = jwt.sign({ foo: 'bar' }, 'secret');

      // Action
      const result = await tokenize.decode(token) as any;

      // Assert
      expect(result.foo).toEqual('bar');
    });
  });
});
