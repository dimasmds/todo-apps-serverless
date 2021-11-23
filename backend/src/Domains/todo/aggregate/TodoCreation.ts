import Todo from '../entities/Todo';
import IdGenerator from '../../../Applications/generator/IdGenerator';
import config from '../../../Commons/config';
import TodoRepository from '../repository/TodoRepository';

type TodoCreationPayload = {
  name: string;
  dueDate: string;
  userId: string
}

class TodoCreation {
  private readonly idGenerator: IdGenerator;

  private readonly todoRepository: TodoRepository;

  constructor(idGenerator: IdGenerator, todoRepository: TodoRepository) {
    this.idGenerator = idGenerator;
    this.todoRepository = todoRepository;
  }

  public async create(payload: TodoCreationPayload): Promise<Todo> {
    TodoCreation.verifyPayload(payload);

    const { name, dueDate, userId } = payload;
    const todoId = await this.idGenerator.generate();

    const newTodo = {
      userId,
      todoId,
      name,
      createdAt: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      done: false,
      attachmentUrl: `https://${config.s3.attachment.bucketName}.s3.amazonaws.com/${todoId}`,
    };

    await this.todoRepository.persist(newTodo);
    return newTodo;
  }

  private static verifyPayload(payload: TodoCreationPayload) {
    const { dueDate } = payload;

    if (!TodoCreation.verifyDueDateFormat(dueDate)) throw new Error('TODO_CREATION.DUE_DATE_SHOULD_YYYY-MM-DD_FORMAT');
    if (!TodoCreation.verifyValidationDueDate(dueDate)) throw new Error('TODO_CREATION.DUE_DATE_SHOULD_GREATER_THAN_NOW');
  }

  private static verifyDueDateFormat(dueDateString: string) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;

    if (!dueDateString.match(regEx)) return false;

    const d = new Date(dueDateString);

    return d.toISOString().slice(0, 10) === dueDateString;
  }

  private static verifyValidationDueDate(dueDateString: string) {
    const dueDate = new Date(dueDateString);
    const thisDate = new Date();

    return thisDate < dueDate;
  }
}

export default TodoCreation;
