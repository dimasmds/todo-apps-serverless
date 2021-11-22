import JwtTokenize from '../../tokenize/JwtTokenize';
import TodoRepository from '../../../Domains/todo/repository/TodoRepository';
import TodoUpdateUseCase from '../TodoUpdateUseCase';

describe('TodoUpdateUseCase', () => {
  const mockJwtTokenize = <JwtTokenize>{};
  const mockTodoRepository = <TodoRepository>{};
  const todoUpdateUseCase = new TodoUpdateUseCase({
    jwtTokenize: mockJwtTokenize,
    todoRepository: mockTodoRepository,
  });

  const currentTodo = {
    userId: 'user-123',
    todoId: 'todo-123',
    name: 'Test todo',
    createdAt: '2020-12-11',
    dueDate: 'dueDate_dummy',
    done: false,
    attachmentUrl: 'attachmentUrl_dummy',
  };

  const payload = {
    todoId: 'todo-123',
    token: 'token-123',
    dueDate: '2020-12-12',
    name: 'Test todo',
    done: true,
  };

  it('should throw error when user not owned todo', async () => {
    // Arrange
    mockJwtTokenize.decode = jest.fn(() => Promise.resolve({
      iss: '',
      sub: 'user-222',
      iat: 0,
      exp: 0,
    }));
    mockTodoRepository.verifyTodoOwner = jest.fn(() => Promise.resolve(false));

    // Action
    await expect(todoUpdateUseCase.execute(payload)).rejects.toThrowError('TODO_UPDATE_USE_CASE.USER_NOT_AN_OWNER');
  });

  it('should orchestrating flow correctly', async () => {
    // Arrange
    mockJwtTokenize.decode = jest.fn(() => Promise.resolve({
      iss: '',
      sub: 'user-123',
      iat: 0,
      exp: 0,
    }));
    mockTodoRepository.verifyTodoOwner = jest.fn(() => Promise.resolve(true));
    mockTodoRepository.getTodoById = jest.fn(() => Promise.resolve(currentTodo));
    mockTodoRepository.update = () => Promise.resolve();

    // Action
    await todoUpdateUseCase.execute(payload);

    // Assert
    expect(mockTodoRepository.verifyTodoOwner).toBeCalledWith(payload.todoId, 'user-123');
    expect(mockTodoRepository.getTodoById).toBeCalledWith(payload.todoId);
  });
});
