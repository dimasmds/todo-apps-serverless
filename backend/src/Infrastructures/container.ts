import { createContainer, ParameterOption } from 'instances-container';
import UUIDGenerator from './generator/UUIDGenerator';
import JwtTokenizeImpl from './tokenize/JwtTokenizeImpl';
import TodoRepositoryDynamoDB from './repositories/TodoRepositoryDynamoDB';
import AWSSecretsManager from './security/AWSSecretsManager';
import TodoCreationUseCase from '../Applications/use_cases/TodoCreationUseCase';
import GetAllTodosUseCase from '../Applications/use_cases/GetAllTodosUseCase';
import TodoDeletionUseCase from '../Applications/use_cases/TodoDeletionUseCase';
import TodoUpdateUseCase from '../Applications/use_cases/TodoUpdateUseCase';
import S3StorageService from './storage/S3StorageService';
import UploadAttachmentUseCase from '../Applications/use_cases/UploadAttachmentUseCase';

const container = createContainer();

const useCaseParameter: ParameterOption = {
  injectType: 'destructuring',
  dependencies: [
    {
      name: 'idGenerator',
      internal: 'IdGenerator',
    },
    {
      name: 'todoRepository',
      internal: 'TodoRepository',
    },
    {
      name: 'jwtTokenize',
      internal: 'JwtTokenize',
    },
    {
      name: 'secretManager',
      internal: 'SecretManager',
    },
    {
      name: 'storageService',
      internal: 'StorageService',
    },
  ],
};

/* Infrastructure */
container.register([
  {
    key: 'IdGenerator',
    Class: UUIDGenerator,
  },
  {
    key: 'JwtTokenize',
    Class: JwtTokenizeImpl,
  },
  {
    key: 'TodoRepository',
    Class: TodoRepositoryDynamoDB,
  },
  {
    key: 'SecretManager',
    Class: AWSSecretsManager,
  },
  {
    key: 'StorageService',
    Class: S3StorageService,
  },
]);

/* UseCase */
container.register([
  {
    key: TodoCreationUseCase.name,
    Class: TodoCreationUseCase,
    parameter: useCaseParameter,
  },
  {
    key: GetAllTodosUseCase.name,
    Class: GetAllTodosUseCase,
    parameter: useCaseParameter,
  },
  {
    key: TodoDeletionUseCase.name,
    Class: TodoDeletionUseCase,
    parameter: useCaseParameter,
  },
  {
    key: TodoUpdateUseCase.name,
    Class: TodoUpdateUseCase,
    parameter: useCaseParameter,
  },
  {
    key: UploadAttachmentUseCase.name,
    Class: UploadAttachmentUseCase,
    parameter: useCaseParameter,
  },
]);

export default container;
