/* eslint-disable no-unused-vars */
import Todo from '../entities/Todo';
import TodoUpdate from '../entities/TodoUpdate';

interface TodoRepository {
  persist(todo: Todo): Promise<void>
  update(todo: TodoUpdate): Promise<void>
  getTodosByUserId(userId: string): Promise<Todo[]>
  verifyTodoOwner(todoId: string, userId: string): Promise<boolean>
  delete(todoId: string): Promise<void>
}

export default TodoRepository;
