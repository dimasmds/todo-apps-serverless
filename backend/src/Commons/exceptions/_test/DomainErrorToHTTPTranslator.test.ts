import DomainErrorToHTTPTranslator from '../DomainErrorToHTTPTranslator';

describe('DomainErrorToHTTPTranslator', () => {
  it('should return original error when message not in directory', () => {
    const error = new Error('test');
    const result = DomainErrorToHTTPTranslator.translate(error);
    expect(result).toBe(error);
  });

  it('should translate error when message in directory', () => {
    const error = new Error('TODO_CREATION.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT');
    const result = DomainErrorToHTTPTranslator.translate(error);
    expect(result).not.toBe(error);
  });
});
