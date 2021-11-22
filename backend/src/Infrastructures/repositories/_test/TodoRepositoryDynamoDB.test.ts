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

  describe('getTodosByUserId', () => {
    it('should return empty array when theres no todos inside', async () => {
      const todos = await todoRepository.getTodosByUserId('user-123');
      expect(todos).toHaveLength(0);
    });

    it('should return todos correctly by id', async () => {
      // Arrange
      await DynamoDBTestHelper.insertTodo({ todoId: 'abc-def', userId: 'user-123' });
      await DynamoDBTestHelper.insertTodo({ todoId: 'abc-def-2', userId: 'user-123' });
      await DynamoDBTestHelper.insertTodo({ todoId: 'abc-def-3', userId: 'user-444' });

      // Action
      const todos = await todoRepository.getTodosByUserId('user-123');

      // Assert
      expect(todos).toHaveLength(2);
      expect(todos[0].todoId).toEqual('abc-def-2');
      expect(todos[1].todoId).toEqual('abc-def');
    });
  });

  describe('verifyTodoOwner', () => {
    it('should return false if user not owned todo', async () => {
      // Arrange
      await DynamoDBTestHelper.insertTodo({ todoId: 'abc-def', userId: 'user-123' });

      // Action
      const result = await todoRepository.verifyTodoOwner('abc-def', 'user-444');

      // Assert
      expect(result).toEqual(false);
    });

    it('should return true if user owned todo', async () => {
      // Arrange
      await DynamoDBTestHelper.insertTodo({ todoId: 'abc-def', userId: 'user-123' });

      // Action
      const result = await todoRepository.verifyTodoOwner('abc-def', 'user-123');

      // Assert
      expect(result).toEqual(true);
    });
  });

  describe('delete', () => {
    it('should delete todo correctly', async () => {
      // Arrange
      await DynamoDBTestHelper.insertTodo({ todoId: 'abc-def' });

      // Action
      await todoRepository.delete('abc-def');

      // Assert
      const todos = await DynamoDBTestHelper.findTodosById('abc-def');
      expect(todos.length).toEqual(0);
    });
  });

  describe('getTodoById', () => {
    it('should return Todo correctly', async () => {
      // Arrange
      await DynamoDBTestHelper.insertTodo({ todoId: 'abc-def' });

      // Action
      const todo = await todoRepository.getTodoById('abc-def');

      // Assert
      expect(todo.todoId).toEqual('abc-def');
    });
  });
});
