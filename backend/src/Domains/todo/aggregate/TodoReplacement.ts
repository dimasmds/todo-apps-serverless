import TodoRepository from '../repository/TodoRepository';
import Todo from '../entities/Todo';
import TodoUpdate from '../entities/TodoUpdate';

type TodoReplacementPayload = {
  name: string,
  done: boolean,
  dueDate: string
};

class TodoReplacement {
  private todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  async replace(currentTodo: Todo, payload: TodoReplacementPayload) {
    TodoReplacement.verifyPayload(currentTodo, payload);

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

  private static verifyPayload(currentTodo: Todo, payload: TodoReplacementPayload) {
    const { dueDate } = payload;
    const { createdAt } = currentTodo;

    if (!TodoReplacement.verifyDueDateFormat(dueDate)) throw new Error('TODO_REPLACEMENT.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT');
    if (!TodoReplacement.verifyValidationDueDate(createdAt, dueDate)) throw new Error('TODO_REPLACEMENT.DUE_DATE_SHOULD_BE_AFTER_CREATED_DATE');
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

export default TodoReplacement;
