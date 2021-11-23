import TodoRepository from '../../../Domains/todo/repository/TodoRepository';
import IdGenerator from '../../generator/IdGenerator';
import JwtTokenize from '../../tokenize/JwtTokenize';
import SecretManager from '../../security/SecretManager';
import StorageService from '../../storage/StorageService';

type UseCaseDependencies = {
  todoRepository?: TodoRepository,
  idGenerator?: IdGenerator
  jwtTokenize?: JwtTokenize
  secretManager?: SecretManager,
  storageService?: StorageService
}

export default UseCaseDependencies;
