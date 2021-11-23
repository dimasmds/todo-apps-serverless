import StorageService from '../../storage/StorageService';
import UploadAttachmentUseCase from '../UploadAttachmentUseCase';
import JwtTokenize from '../../tokenize/JwtTokenize';
import TodoRepository from '../../../Domains/todo/repository/TodoRepository';

describe('UploadAttachmentUseCase', () => {
  const mockStorageService = <StorageService>{};
  const mockJwtTokenize = <JwtTokenize>{};
  const mockTodoRepository = <TodoRepository>{};
  const uploadAttachmentUseCase = new UploadAttachmentUseCase({
    storageService: mockStorageService,
    jwtTokenize: mockJwtTokenize,
    todoRepository: mockTodoRepository,
  });

  it('should throw error when user is not todo owner', async () => {
    // Arrange
    const payload = {
      todoId: 'image',
      token: '123',
    };
    mockJwtTokenize.decode = jest.fn(() => Promise.resolve({
      iss: '',
      sub: 'user-123',
      iat: 0,
      exp: 0,
    }));
    mockTodoRepository.verifyTodoOwner = jest.fn(() => Promise.resolve(false));

    // Assert
    await expect(uploadAttachmentUseCase.execute(payload)).rejects.toThrowError('UPDATE_ATTACHMENT_USE_CASE.USER_NOT_AN_OWNER');
    expect(mockJwtTokenize.decode).toHaveBeenCalledWith('123');
    expect(mockTodoRepository.verifyTodoOwner).toHaveBeenCalledWith('image', 'user-123');
  });

  it('should orchestrating flow correctly', async () => {
    // Arrange
    const payload = {
      todoId: 'image',
      token: '123',
    };
    mockJwtTokenize.decode = () => Promise.resolve({
      iss: '',
      sub: 'user-123',
      iat: 0,
      exp: 0,
    });
    mockTodoRepository.verifyTodoOwner = () => Promise.resolve(true);
    mockStorageService.getPutPreSignedUrl = jest.fn(() => Promise.resolve('https://storage-service.com/images'));

    // Action
    const result = await uploadAttachmentUseCase.execute(payload);

    // Assert
    expect(result).toEqual('https://storage-service.com/images');
    expect(mockStorageService.getPutPreSignedUrl).toHaveBeenCalledWith(payload.todoId);
  });
});
