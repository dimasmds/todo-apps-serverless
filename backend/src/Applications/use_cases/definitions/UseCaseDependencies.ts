import TodoRepository from '../../../Domains/todo/repository/TodoRepository';
import IdGenerator from '../../generator/IdGenerator';
import JwtTokenize from '../../tokenize/JwtTokenize';

type UseCaseDependencies = {
  todoRepository: TodoRepository,
  idGenerator: IdGenerator
  jwtTokenize: JwtTokenize
}

export default UseCaseDependencies;
