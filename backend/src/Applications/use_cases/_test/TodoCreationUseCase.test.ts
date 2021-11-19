import TodoCreationUseCase from '../TodoCreationUseCase';
import TodoRepository from '../../../Domains/todo/repository/TodoRepository';
import IdGenerator from '../../generator/IdGenerator';
import JwtTokenize from '../../tokenize/JwtTokenize';
import config from '../../../Commons/config';

describe('TodoCreationUseCase', () => {
  const fakeTodoRepository = <TodoRepository>{};
  const fakeIdGenerator = <IdGenerator>{};
  const mockJwtTokenize = <JwtTokenize>{};

  const todoCreationUseCase = new TodoCreationUseCase({
    idGenerator: fakeIdGenerator,
    todoRepository: fakeTodoRepository,
    jwtTokenize: mockJwtTokenize,
  });

  describe('execute', () => {
    it('should throw error when accessToken is not verified', async () => {
      mockJwtTokenize.verify = jest.fn(() => Promise.resolve(false));

      const payload = {
        name: 'test',
        dueDate: '2020-10-11',
        accessToken: 'abc',
      };

      await expect(todoCreationUseCase.execute(payload)).rejects.toThrowError('TODO_CREATION_USE_CASE.ACCESS_TOKEN_INVALID');
      expect(mockJwtTokenize.verify)
        .toBeCalledWith(payload.accessToken, config.auth.accessToken.secret);
    });

    it('should orchestrating flow correctly', async () => {
      mockJwtTokenize.verify = jest.fn(() => Promise.resolve(true));
      mockJwtTokenize.decode = jest.fn(() => Promise.resolve({
        sub: 'user-123',
        iss: 'test',
        iat: 123,
        exp: 123,
      }));

      fakeIdGenerator.generate = () => Promise.resolve('abc-def');
      fakeTodoRepository.persist = () => Promise.resolve();

      const tomorrowInYYYYDDMM = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
      const payload = {
        name: 'test',
        dueDate: tomorrowInYYYYDDMM,
        accessToken: 'abc',
      };

      const newTodo = await todoCreationUseCase.execute(payload);

      expect(mockJwtTokenize.decode).toBeCalledWith(payload.accessToken);
      expect(newTodo).toEqual({
        todoId: 'abc-def',
        name: 'test',
        createdAt: expect.any(String),
        dueDate: new Date(tomorrowInYYYYDDMM).toISOString(),
        done: false,
        userId: 'user-123',
        attachmentUrl: 'https://test-bucket.s3.amazonaws.com/abc-def',
      });
    });
  });
});
