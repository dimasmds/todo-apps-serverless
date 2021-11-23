import InvariantError from './InvariantError';
import AuthorizationError from './AuthorizationError';

class DomainErrorToHTTPTranslator {
  static dictionary: any = {
    'TODO_CREATION.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT': new InvariantError('Due date should have format YYYY-MM-DD'),
    'TODO_CREATION.DUE_DATE_SHOULD_GREATER_THAN_NOW': new InvariantError('Due date should be greater than now'),
    'TODO_REPLACEMENT.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT': new InvariantError('Due date should have format YYYY-MM-DD'),
    'TODO_REPLACEMENT.DUE_DATE_SHOULD_BE_AFTER_CREATED_DATE': new InvariantError('Due date should be after created date'),
    'TODO_DELETION_USE_CASE.USER_NOT_AN_OWNER': new AuthorizationError('You are not allowed to delete this todo'),
    'TODO_UPDATE_USE_CASE.USER_NOT_AN_OWNER': new AuthorizationError('You are not allowed to update this todo'),
    'UPDATE_ATTACHMENT_USE_CASE.USER_NOT_AN_OWNER': new AuthorizationError('You are not allowed to update this attachment'),
  }

  static translate(error: Error) : Error {
    return DomainErrorToHTTPTranslator.dictionary[error.message] || error;
  }
}

export default DomainErrorToHTTPTranslator;
