import { urlBase64Decode } from '../../helpers';

export abstract class FlexAuthToken {

  protected payload: any = null;

  abstract getValue(): string;
  abstract isValid(): boolean;
  abstract getOwnerStrategyName(): string;
  abstract getCreatedAt(): Date;
  abstract toString(): string;

  getName(): string {
    return (this.constructor as FlexAuthTokenClass).NAME;
  }

  getPayload(): any {
    return this.payload;
  }
}

export class FlexAuthTokenNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class FlexAuthIllegalTokenError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class FlexAuthEmptyTokenError extends FlexAuthIllegalTokenError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class FlexAuthIllegalJWTTokenError extends FlexAuthIllegalTokenError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// todo resolver
export interface NbAuthRefreshableToken {
  getRefreshToken(): string;
  setRefreshToken(refreshToken: string);
}

export interface FlexAuthTokenClass<T = FlexAuthToken> {
  NAME: string;
  new (raw: any, strategyName: string, expDate?: Date): T;
}

export function authCreateToken<T extends FlexAuthToken>(tokenClass: FlexAuthTokenClass<T>,
                                                         token: any,
                                                         ownerStrategyName: string,
                                                         createdAt?: Date) {
  return new tokenClass(token, ownerStrategyName, createdAt);
}

export function decodeJwtPayload(payload: string): any {

  if (payload.length === 0) {
    throw new FlexAuthEmptyTokenError('Cannot extract from an empty payload.');
  }

  const parts = payload.split('.');

  if (parts.length !== 3) {
    throw new FlexAuthIllegalJWTTokenError(
      `The payload ${payload} is not valid JWT payload and must consist of three parts.`);
  }

  let decoded;
  try {
    decoded = urlBase64Decode(parts[1]);
  } catch (e) {
    throw new FlexAuthIllegalJWTTokenError(
      `The payload ${payload} is not valid JWT payload and cannot be parsed.`);
  }

  if (!decoded) {
    throw new FlexAuthIllegalJWTTokenError(
      `The payload ${payload} is not valid JWT payload and cannot be decoded.`);
  }
  return JSON.parse(decoded);
}

export class FlexAuthSimpleToken extends FlexAuthToken {

  static NAME = 'nb:auth:simple:token';

  constructor(protected readonly token: any,
              protected readonly ownerStrategyName: string,
              protected createdAt?: Date) {
    super();
    try {
      this.parsePayload();
    } catch (err) {
      if (!(err instanceof FlexAuthTokenNotFoundError)) {
        throw err;
      }
    }
    this.createdAt = this.prepareCreatedAt(createdAt);
  }

  protected parsePayload(): any {
    this.payload = null;
  }

  protected prepareCreatedAt(date: Date) {
    return date ? date : new Date();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getValue(): string {
    return this.token;
  }

  getOwnerStrategyName(): string {
    return this.ownerStrategyName;
  }

  isValid(): boolean {
    return !!this.getValue();
  }

  toString(): string {
    return !!this.token ? this.token : '';
  }
}

export class FlexAuthJWTToken extends FlexAuthSimpleToken {

  static NAME = 'app:auth:jwt:token';

  protected prepareCreatedAt(date: Date) {
      const decoded = this.getPayload();
      return decoded && decoded.iat ? new Date(Number(decoded.iat) * 1000) : super.prepareCreatedAt(date);
  }

  protected parsePayload(): void {
    if (!this.token) {
      throw new FlexAuthTokenNotFoundError('Token not found. ');
    }
    this.payload = decodeJwtPayload(this.token);
  }

  getTokenExpDate(): Date {
    const decoded = this.getPayload();
    if (decoded && !decoded.hasOwnProperty('exp')) {
      return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isValid(): boolean {
    return super.isValid() && (!this.getTokenExpDate() || new Date() < this.getTokenExpDate());
  }
}


