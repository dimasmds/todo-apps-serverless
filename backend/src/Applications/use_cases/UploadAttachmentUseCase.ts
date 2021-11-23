import UseCaseDependencies from './definitions/UseCaseDependencies';
import StorageService from '../storage/StorageService';

type UseCasePayload = {
  key: string
}

class UploadAttachmentUseCase {
  private storageService: StorageService;

  constructor({ storageService } : UseCaseDependencies) {
    this.storageService = storageService;
  }

  async execute({ key }: UseCasePayload) {
    return this.storageService.getPutPreSignedUrl(key);
  }
}

export default UploadAttachmentUseCase;
