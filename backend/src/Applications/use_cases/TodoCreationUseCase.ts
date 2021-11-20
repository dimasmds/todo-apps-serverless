import UseCaseDependencies from './definitions/UseCaseDependencies';
import IdGenerator from '../generator/IdGenerator';
import TodoRepository from '../../Domains/todo/repository/TodoRepository';
import Todo from '../../Domains/todo/entities/Todo';
import TodoCreation from '../../Domains/todo/aggregate/TodoCreation';
import JwtTokenize from '../tokenize/JwtTokenize';

type UseCasePayload = {
  name: string;
  dueDate: string;
  accessToken: string
}

class TodoCreationUseCase {
  private readonly idGenerator: IdGenerator;

  private readonly todoRepository: TodoRepository;

  private readonly jwtTokenize: JwtTokenize;

  constructor({
    idGenerator, todoRepository, jwtTokenize,
  }: UseCaseDependencies) {
    this.idGenerator = idGenerator;
    this.todoRepository = todoRepository;
    this.jwtTokenize = jwtTokenize;
  }

  async execute(payload: UseCasePayload): Promise<Todo> {
    const { accessToken } = payload;

    const { sub: userId } = await this.jwtTokenize.decode(accessToken);

    const todoCreation = new TodoCreation(this.idGenerator, this.todoRepository);

    return todoCreation.create({
      ...payload,
      userId,
    });
  }
}

export default TodoCreationUseCase;
