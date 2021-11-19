import * as uuid from 'uuid';
import IdGenerator from '../../Applications/generator/IdGenerator';

class UUIDGenerator implements IdGenerator {
  async generate(): Promise<string> {
    return uuid.v4();
  }
}

export default UUIDGenerator;
