import StorageService from '../../storage/StorageService';
import UploadAttachmentUseCase from '../UploadAttachmentUseCase';

describe('UploadAttachmentUseCase', () => {
  const mockStorageService = <StorageService>{};
  const uploadAttachmentUseCase = new UploadAttachmentUseCase({
    storageService: mockStorageService,
  });

  it('should orchestrating flow correctly', async () => {
    // Arrange
    const payload = {
      key: 'image',
    };
    mockStorageService.getPutPreSignedUrl = jest.fn(() => Promise.resolve('https://storage-service.com/images'));

    // Action
    const result = await uploadAttachmentUseCase.execute(payload);

    // Assert
    expect(result).toEqual('https://storage-service.com/images');
    expect(mockStorageService.getPutPreSignedUrl).toHaveBeenCalledWith(payload.key);
  });
});
