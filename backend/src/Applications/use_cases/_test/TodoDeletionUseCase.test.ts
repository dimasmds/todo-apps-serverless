import JwtTokenize from '../../tokenize/JwtTokenize';
import TodoRepository from '../../../Domains/todo/repository/TodoRepository';
import TodoDeletionUseCase from '../TodoDeletionUseCase';

describe('TodoDeletionUseCase', () => {
  const mockJwtTokenize = <JwtTokenize>{};
  const mockTodoRepository = <TodoRepository>{};
  const todoDeletionUseCase = new TodoDeletionUseCase({
    jwtTokenize: mockJwtTokenize,
    todoRepository: mockTodoRepository,
  });

  it('should throw error when user is not todo owner', async () => {
    const payload = {
      todoId: '123',
      token: 'abc',
    };

    mockJwtTokenize.decode = jest.fn(() => Promise.resolve({
      iss: '',
      sub: 'user-123',
      iat: 0,
      exp: 0,
    }));
    mockTodoRepository.verifyTodoOwner = jest.fn(() => Promise.resolve(false));

    // Action
    await expect(todoDeletionUseCase.execute(payload)).rejects.toThrowError('TODO_DELETION_USE_CASE.USER_NOT_AN_OWNER');
    expect(mockJwtTokenize.decode).toBeCalledWith(payload.token);
    expect(mockTodoRepository.verifyTodoOwner).toBeCalledWith(payload.todoId, 'user-123');
  });

  it('should orchestrating flow correctly', async () => {
    const payload = {
      todoId: '123',
      token: 'abc',
    };

    mockJwtTokenize.decode = jest.fn(() => Promise.resolve({
      iss: '',
      sub: 'user-123',
      iat: 0,
      exp: 0,
    }));
    mockTodoRepository.verifyTodoOwner = jest.fn(() => Promise.resolve(true));
    mockTodoRepository.deleteTodo = jest.fn(() => Promise.resolve());

    await todoDeletionUseCase.execute(payload);

    expect(mockTodoRepository.deleteTodo).toBeCalledWith('123');
  });
});
