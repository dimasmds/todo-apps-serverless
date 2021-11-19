/* eslint-disable no-unused-vars */
import Todo from '../entities/Todo';

interface TodoRepository {
  persist(todo: Todo): Promise<void>;
}

export default TodoRepository;
