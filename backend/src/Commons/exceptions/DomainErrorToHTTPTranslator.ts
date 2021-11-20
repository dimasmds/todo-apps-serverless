import InvariantError from './InvariantError';

class DomainErrorToHTTPTranslator {
  static dictionary: any = {
    'TODO_CREATION.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT': new InvariantError('Due date should have format YYYY-MM-DD'),
    'TODO_CREATION.DUE_DATE_SHOULD_GREATER_THAN_NOW': new InvariantError('Due date should be greater than now'),
    'TODO_REPLACEMENT.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT': new InvariantError('Due date should have format YYYY-MM-DD'),
    'TODO_REPLACEMENT.DUE_DATE_SHOULD_BE_AFTER_CREATED_DATE': new InvariantError('Due date should be after created date'),

  }

  static translate(error: Error) : Error {
    return DomainErrorToHTTPTranslator.dictionary[error.message] || error;
  }
}

export default DomainErrorToHTTPTranslator;
