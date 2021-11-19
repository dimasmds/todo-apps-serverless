import TodoCreation from '../TodoCreation';
import IdGenerator from '../../../../Applications/generator/IdGenerator';
import TodoRepository from '../../repository/TodoRepository';

describe('TodoCreation', () => {
  const mockIdGenerator = <IdGenerator>{};
  const mockTodoRepository = <TodoRepository>{};
  const todoCreation = new TodoCreation(mockIdGenerator, mockTodoRepository);

  describe('create', () => {
    it('should throw error when due date is not YYYY-MM-DD', async () => {
      await expect(todoCreation.create({
        name: 'test',
        dueDate: 'test',
      })).rejects.toThrowError('TODO_CREATION.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT');
    });

    it('should throw error when due date less than creation date', async () => {
      const yesterdayInYYYYMMDD = new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString().split('T')[0];

      await expect(todoCreation.create({
        name: 'test',
        dueDate: yesterdayInYYYYMMDD,
      })).rejects.toThrowError('TODO_CREATION.DUE_DATE_SHOULD_GREATER_THAN_NOW');
    });

    it('should create Todo correctly', async () => {
      const payload = {
        name: 'test',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
          .toISOString().split('T')[0],
      };

      mockIdGenerator.generate = jest.fn(() => Promise.resolve('abc-def'));
      mockTodoRepository.persist = jest.fn(() => Promise.resolve());

      const newTodo = await todoCreation.create(payload);

      expect(mockTodoRepository.persist).toBeCalledWith(newTodo);

      expect(newTodo).toEqual({
        todoId: 'abc-def',
        name: 'test',
        dueDate: new Date(payload.dueDate).toISOString(),
        createdAt: expect.any(String),
        done: false,
        attachmentUrl: 'https://test-bucket.s3.amazonaws.com/abc-def',
      });
    });
  });
});
