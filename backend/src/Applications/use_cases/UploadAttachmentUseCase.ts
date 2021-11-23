import UseCaseDependencies from './definitions/UseCaseDependencies';
import StorageService from '../storage/StorageService';
import JwtTokenize from '../tokenize/JwtTokenize';
import TodoRepository from '../../Domains/todo/repository/TodoRepository';

type UseCasePayload = {
  todoId: string
  token: string
}

class UploadAttachmentUseCase {
  private storageService: StorageService;

  private jwtTokenize: JwtTokenize;

  private todoRepository: TodoRepository;

  constructor({ storageService, jwtTokenize, todoRepository } : UseCaseDependencies) {
    this.storageService = storageService;
    this.jwtTokenize = jwtTokenize;
    this.todoRepository = todoRepository;
  }

  async execute({ todoId, token }: UseCasePayload) {
    const { sub } = await this.jwtTokenize.decode(token);
    const isTodoOwner = await this.todoRepository.verifyTodoOwner(todoId, sub);

    if (!isTodoOwner) throw new Error('UPDATE_ATTACHMENT_USE_CASE.USER_NOT_AN_OWNER');

    return this.storageService.getPutPreSignedUrl(todoId);
  }
}

export default UploadAttachmentUseCase;
