import TodoRepository from '../../../Domains/todo/repository/TodoRepository';
import GetAllTodosUseCase from '../GetAllTodosUseCase';
import Todo from '../../../Domains/todo/entities/Todo';
import JwtTokenize from '../../tokenize/JwtTokenize';

describe('GetAllTodosUseCase', () => {
  const mockTodoRepository = <TodoRepository>{};
  const mockJwtTokenize = <JwtTokenize>{};
  const getAllTodosUseCase = new GetAllTodosUseCase({
    todoRepository: mockTodoRepository,
    jwtTokenize: mockJwtTokenize,
  });

  it('should orchestrating flow correctly', async () => {
    const expectedTodos: Todo[] = [
      {
        todoId: 'abc',
        userId: 'user-123',
        name: 'Todo 1',
        dueDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: 'https://blabla',
      },
      {
        todoId: 'abc-def',
        userId: 'user-123',
        name: 'Todo 1',
        dueDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: 'https://blabla',
      },
    ];

    mockJwtTokenize.decode = jest.fn(() => Promise.resolve({
      iss: '',
      sub: 'user-123',
      iat: 0,
      exp: 0,
    }));
    mockTodoRepository.getTodosByUserId = jest.fn(() => Promise.resolve(expectedTodos));

    const payload = { token: 'dummyToken' };

    // Action
    const todos = await getAllTodosUseCase.execute(payload);

    // Assert
    expect(todos).toEqual(expectedTodos);
    expect(mockTodoRepository.getTodosByUserId).toBeCalledWith('user-123');
  });
});
