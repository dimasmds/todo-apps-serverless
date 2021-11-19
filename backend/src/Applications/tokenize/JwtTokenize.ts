/* eslint-disable no-unused-vars */

export type TokenPayload = {
  iss: string
  sub: string
  iat: number
  exp: number
}

interface JwtTokenize {
  decode(token: string): Promise<TokenPayload>;
  verify(token: string, secret: string): Promise<boolean>;
}

export default JwtTokenize;
