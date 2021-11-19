import TodoRepository from '../repository/TodoRepository';
import Todo from '../entities/Todo';
import TodoUpdate from '../entities/TodoUpdate';

type TodoUpdatePayload = {
  name: string,
  done: boolean,
  dueDate: string
};

class TodoUpdating {
  private todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  async update(currentTodo: Todo, payload: TodoUpdatePayload) {
    TodoUpdating.verifyPayload(currentTodo, payload);

    const { todoId } = currentTodo;
    const { name, done, dueDate } = payload;

    const todoUpdate: TodoUpdate = {
      todoId,
      name,
      done,
      dueDate: new Date(dueDate).toISOString(),
    };

    await this.todoRepository.update(todoUpdate);
  }

  private static verifyPayload(currentTodo: Todo, payload: TodoUpdatePayload) {
    const { dueDate } = payload;
    const { createdAt } = currentTodo;

    if (!TodoUpdating.verifyDueDateFormat(dueDate)) throw new Error('TODO_UPDATE.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT');
    if (!TodoUpdating.verifyValidationDueDate(createdAt, dueDate)) throw new Error('TODO_UPDATE.DUE_DATE_SHOULD_BE_AFTER_CREATED_DATE');
  }

  private static verifyDueDateFormat(dueDateString: string) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dueDateString.match(regEx)) return false;
    const d = new Date(dueDateString);
    return d.toISOString().slice(0, 10) === dueDateString;
  }

  private static verifyValidationDueDate(createdAt: string, dueDate: string) {
    return new Date(createdAt) < new Date(dueDate);
  }
}

export default TodoUpdating;
