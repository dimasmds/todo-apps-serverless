import UseCaseDependencies from './definitions/UseCaseDependencies';
import JwtTokenize from '../tokenize/JwtTokenize';
import TodoRepository from '../../Domains/todo/repository/TodoRepository';
import TodoReplacement from '../../Domains/todo/aggregate/TodoReplacement';

type UseCasePayload = {
  todoId: string;
  token: string;
  dueDate: string;
  name: string;
  done: boolean;
}

class TodoUpdateUseCase {
  private jwtTokenize: JwtTokenize;

  private readonly todoRepository: TodoRepository;

  constructor({
    jwtTokenize,
    todoRepository,
  }: UseCaseDependencies) {
    this.jwtTokenize = jwtTokenize;
    this.todoRepository = todoRepository;
  }

  async execute({
    todoId, name, dueDate, token, done,
  }: UseCasePayload) {
    const { sub } = await this.jwtTokenize.decode(token);
    const isGranted = await this.todoRepository.verifyTodoOwner(todoId, sub);

    if (!isGranted) throw new Error('TODO_UPDATE_USE_CASE.USER_NOT_AN_OWNER');

    const currentTodo = await this.todoRepository.getTodoById(todoId);

    const todoReplacement = new TodoReplacement(this.todoRepository);

    await todoReplacement.replace(currentTodo, {
      name,
      dueDate,
      done,
    });
  }
}

export default TodoUpdateUseCase;
