import TodoRepositoryDynamoDB from '../TodoRepositoryDynamoDB';
import Todo from '../../../Domains/todo/entities/Todo';
import DynamoDBTestHelper from './helper/DynamoDBTestHelper';
import TodoUpdate from '../../../Domains/todo/entities/TodoUpdate';

describe('TodoRepositoryDynamoDB', () => {
  const todoRepository = new TodoRepositoryDynamoDB();

  beforeEach(async () => {
    await DynamoDBTestHelper.cleanTodosTable();
  });

  describe('persist', () => {
    it('should persist a todo', async () => {
      const todo: Todo = {
        todoId: 'abc-def',
        userId: 'user-123',
        name: 'test',
        done: false,
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        attachmentUrl: '',
      };

      await todoRepository.persist(todo);

      const foundedTodos = await DynamoDBTestHelper.findTodosById('abc-def');
      expect(foundedTodos.length).toEqual(1);
      expect(foundedTodos[0].todoId).toEqual('abc-def');
      expect(foundedTodos[0].userId).toEqual('user-123');
      expect(foundedTodos[0].name).toEqual('test');
      expect(foundedTodos[0].done).toEqual(false);
      expect(foundedTodos[0].createdAt).toEqual(todo.createdAt);
      expect(foundedTodos[0].dueDate).toEqual(todo.dueDate);
      expect(foundedTodos[0].attachmentUrl).toEqual('');
    });
  });
  describe('update', () => {
    it('should update the existing todo', async () => {
      // Arrange
      const todo: Todo = {
        todoId: 'abc-def',
        userId: 'user-123',
        name: 'test',
        done: false,
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        attachmentUrl: '',
      };
      await todoRepository.persist(todo);

      const todoUpdate: TodoUpdate = {
        todoId: todo.todoId,
        name: 'new test',
        dueDate: todo.dueDate,
        done: true,
      };

      // Action
      await todoRepository.update(todoUpdate);

      // Assert
      const foundedTodos = await DynamoDBTestHelper.findTodosById(todo.todoId);
      expect(foundedTodos.length).toEqual(1);
      expect(foundedTodos[0].todoId).toEqual(todo.todoId);
      expect(foundedTodos[0].userId).toEqual(todo.userId);
      expect(foundedTodos[0].name).toEqual(todoUpdate.name);
      expect(foundedTodos[0].done).toEqual(todoUpdate.done);
      expect(foundedTodos[0].createdAt).toEqual(todo.createdAt);
      expect(foundedTodos[0].dueDate).toEqual(todoUpdate.dueDate);
      expect(foundedTodos[0].attachmentUrl).toEqual('');
    });
  });
});