import TodoReplacement from '../TodoReplacement';
import TodoRepository from '../../repository/TodoRepository';
import Todo from '../../entities/Todo';

describe('TodoReplacement', () => {
  const mockTodoRepository = <TodoRepository>{};
  const todoReplacement = new TodoReplacement(mockTodoRepository);

  const todayInISOString = new Date().toISOString();
  const tomorrowInISOString = new Date(
    new Date().getTime() + 24 * 60 * 60 * 1000,
  ).toISOString();

  const currentTodo: Todo = {
    todoId: 'abc-def',
    name: 'name',
    createdAt: todayInISOString,
    dueDate: tomorrowInISOString,
    done: false,
    userId: 'user-id',
    attachmentUrl: '',
  };

  describe('replace', () => {
    it('should replace the todo', async () => {
      const tomorrowInYYYYMMDD = new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000,
      ).toISOString().split('T')[0];

      const payload = {
        name: 'newName',
        dueDate: tomorrowInYYYYMMDD,
        done: true,
      };

      mockTodoRepository.update = jest.fn(() => Promise.resolve());

      await todoReplacement.replace(currentTodo, payload);

      expect(mockTodoRepository.update).toBeCalledWith({
        todoId: currentTodo.todoId,
        name: payload.name,
        dueDate: new Date(tomorrowInYYYYMMDD).toISOString(),
        done: payload.done,
      });
    });
  });
});
