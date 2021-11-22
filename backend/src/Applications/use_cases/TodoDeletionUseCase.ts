import UseCaseDependencies from './definitions/UseCaseDependencies';
import JwtTokenize from '../tokenize/JwtTokenize';
import TodoRepository from '../../Domains/todo/repository/TodoRepository';

type UseCasePayload = {
  todoId: string
  token: string
};

class TodoDeletionUseCase {
  private jwtTokenize: JwtTokenize;

  private todoRepository: TodoRepository;

  constructor({ jwtTokenize, todoRepository }: UseCaseDependencies) {
    this.jwtTokenize = jwtTokenize;
    this.todoRepository = todoRepository;
  }

  async execute({ todoId, token }: UseCasePayload) {
    const { sub } = await this.jwtTokenize.decode(token);
    const isGranted = await this.todoRepository.verifyTodoOwner(todoId, sub);

    if (!isGranted) throw new Error('TODO_DELETION_USE_CASE.USER_NOT_AN_OWNER');

    await this.todoRepository.deleteTodo(todoId);
  }
}

export default TodoDeletionUseCase;
