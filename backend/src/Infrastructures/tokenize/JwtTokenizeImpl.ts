import * as jwt from 'jsonwebtoken';
import JwtTokenize, { TokenPayload } from '../../Applications/tokenize/JwtTokenize';

class JwtTokenizeImpl implements JwtTokenize {
  async decode(token: string): Promise<TokenPayload> {
    return jwt.decode(token) as TokenPayload;
  }

  async verify(token: string, secret: string): Promise<boolean> {
    try {
      await jwt.verify(token, secret);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default JwtTokenizeImpl;
