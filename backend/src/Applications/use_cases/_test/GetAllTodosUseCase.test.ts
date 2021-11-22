import TodoRepository from '../../../Domains/todo/repository/TodoRepository';
import GetAllTodosUseCase from '../GetAllTodosUseCase';
import Todo from '../../../Domains/todo/entities/Todo';

describe('GetAllTodosUseCase', () => {
  const mockTodoRepository = <TodoRepository>{};
  const getAllTodosUseCase = new GetAllTodosUseCase({
    todoRepository: mockTodoRepository,
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

    mockTodoRepository.getTodosByUserId = jest.fn(() => Promise.resolve(expectedTodos));

    const payload = { userId: 'user-123' };

    // Action
    const todos = await getAllTodosUseCase.execute(payload);

    // Assert
    expect(todos).toEqual(expectedTodos);
    expect(mockTodoRepository.getTodosByUserId).toBeCalledWith(payload.userId);
  });
});
