import UseCaseDependencies from './definitions/UseCaseDependencies';
import TodoRepository from '../../Domains/todo/repository/TodoRepository';
import JwtTokenize from '../tokenize/JwtTokenize';

type UseCasePayload = {
  token: string
}

class GetAllTodosUseCase {
  private todoRepository: TodoRepository;

  private jwtTokenize: JwtTokenize;

  constructor({ todoRepository, jwtTokenize }: UseCaseDependencies) {
    this.todoRepository = todoRepository;
    this.jwtTokenize = jwtTokenize;
  }

  async execute({ token }: UseCasePayload) {
    const { sub } = await this.jwtTokenize.decode(token);
    return this.todoRepository.getTodosByUserId(sub);
  }
}

export default GetAllTodosUseCase;
