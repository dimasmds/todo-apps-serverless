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
}

export default TodoReplacement;
