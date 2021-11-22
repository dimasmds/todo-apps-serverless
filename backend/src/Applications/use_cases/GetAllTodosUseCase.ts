import UseCaseDependencies from './definitions/UseCaseDependencies';
import TodoRepository from '../../Domains/todo/repository/TodoRepository';

type UseCasePayload = {
  userId: string
}

class GetAllTodosUseCase {
  private todoRepository: TodoRepository;

  constructor({ todoRepository }: UseCaseDependencies) {
    this.todoRepository = todoRepository;
  }

  async execute({ userId }: UseCasePayload) {
    return this.todoRepository.getTodosByUserId(userId);
  }
}

export default GetAllTodosUseCase;
