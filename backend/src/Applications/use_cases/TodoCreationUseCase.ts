import UseCaseDependencies from './definitions/UseCaseDependencies';
import IdGenerator from '../generator/IdGenerator';
import TodoRepository from '../../Domains/todo/repository/TodoRepository';
import Todo from '../../Domains/todo/entities/Todo';
import TodoCreation from '../../Domains/todo/aggregate/TodoCreation';
import JwtTokenize from '../tokenize/JwtTokenize';
import config from '../../Commons/config';

type UseCasePayload = {
  name: string;
  dueDate: string;
  accessToken: string
}

class TodoCreationUseCase {
  private readonly idGenerator: IdGenerator;

  private readonly todoRepository: TodoRepository;

  private jwtTokenize: JwtTokenize;

  constructor({ idGenerator, todoRepository, jwtTokenize }: UseCaseDependencies) {
    this.idGenerator = idGenerator;
    this.todoRepository = todoRepository;
    this.jwtTokenize = jwtTokenize;
  }

  async execute(payload: UseCasePayload): Promise<Todo> {
    const { accessToken } = payload;
    const isTokenVerified = await this.jwtTokenize.verify(
      accessToken, config.auth.accessToken.secret,
    );

    if (!isTokenVerified) throw new Error('TODO_CREATION_USE_CASE.ACCESS_TOKEN_INVALID');

    const { sub: userId } = await this.jwtTokenize.decode(accessToken);

    const todoCreation = new TodoCreation(this.idGenerator, this.todoRepository);

    return todoCreation.create({
      ...payload,
      userId,
    });
  }
}

export default TodoCreationUseCase;
