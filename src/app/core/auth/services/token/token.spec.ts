import { FlexAuthJWTToken, FlexAuthSimpleToken } from './token';


describe('auth token', () => {
  describe('AuthJWTToken', () => {
    const now = new Date();

    // tslint:disable
    const simpleToken = new FlexAuthSimpleToken('token','strategy');
    const validJWTToken = new FlexAuthJWTToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjZXJlbWEuZnIiLCJpYXQiOjE1MzIzNTA4MDAsImV4cCI6MjUzMjM1MDgwMCwic3ViIjoiQWxhaW4gQ0hBUkxFUyIsImFkbWluIjp0cnVlfQ.Rgkgb4KvxY2wp2niXIyLJNJeapFp9z3tCF-zK6Omc8c', 'strategy');

    const noIatJWTToken = new FlexAuthJWTToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjZXJlbWEuZnIiLCJleHAiOjE1MzI0MzcyMDAsInN1YiI6IkFsYWluIENIQVJMRVMiLCJhZG1pbiI6dHJ1ZX0.cfwQlKo6xomXkE-U-SOqse2GjdxncOuhdd1VWIOiYzA', 'strategy');

    const noExpJWTToken = new FlexAuthJWTToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjZXJlbWEuZnIiLCJpYXQiOjE1MzIzNTA4MDAsInN1YiI6IkFsYWluIENIQVJMRVMiLCJhZG1pbiI6dHJ1ZX0.heHVXkHexwqbPCPUAvkJlXO6tvxzxTKf4iP0OWBbp7Y','strategy');

    const expiredJWTToken = new FlexAuthJWTToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzY290Y2guaW8iLCJleHAiOjEzMDA4MTkzODAsIm5hbWUiOiJDaHJpcyBTZXZpbGxlamEiLCJhZG1pbiI6dHJ1ZX0.03f329983b86f7d9a9f5fef85305880101d5e302afafa20154d094b229f75773','strategy');

    // tslint:enable

    it('JWT Token constructor, not valid JWT token, must consist of three parts', () => {
      expect(() => new FlexAuthJWTToken('.', 'strategy'))
        .toThrow(new Error(
          `The payload . is not valid JWT payload and must consist of three parts.`));
    });

    it('JWT Token constructor,, not valid JWT token, cannot be decoded', () => {
      expect(() => new FlexAuthJWTToken('..', 'strategy'))
        .toThrow(new Error(
          `The payload .. is not valid JWT payload and cannot be decoded.`));
    });

    it('getPayload, not valid base64 in JWT token, cannot be decoded', () => {
      expect(() => new FlexAuthJWTToken('h%2BHY.h%2BHY.h%2BHY', 'strategy'))
        .toThrow(new Error(
          `The payload h%2BHY.h%2BHY.h%2BHY is not valid JWT payload and cannot be parsed.`));
    });

    it('getPayload success', () => {
      expect(validJWTToken.getPayload())
      // tslint:disable-next-line
        .toEqual(JSON.parse('{"iss":"cerema.fr","iat":1532350800,"exp":2532350800,"sub":"Alain CHARLES","admin":true}'));
    });


    it('getCreatedAt success : now for simpleToken', () => {
      // we consider dates are the same if differing from minus than 10 ms
      expect(simpleToken.getCreatedAt().getTime() - now.getTime() < 10);
    });

    it('getCreatedAt success : exp for validJWTToken', () => {
      const date = new Date();
      date.setTime(1532350800000)
      expect(validJWTToken.getCreatedAt()).toEqual(date);
    });

    it('getCreatedAt success : now for noIatJWTToken', () => {
      // we consider dates are the same if differing from minus than 10 ms
      expect(noIatJWTToken.getCreatedAt().getTime() - now.getTime() < 10);
    });

    it('getCreatedAt success : now for simpleToken', () => {
      // we consider dates are the same if differing from minus than 10 ms
      expect(simpleToken.getCreatedAt().getTime() - now.getTime() < 10);
    });

    it('getCreatedAt success : exp for validJWTToken', () => {
      const date = new Date();
      date.setTime(1532350800000)
      expect(validJWTToken.getCreatedAt()).toEqual(date);
    });

    it('getCreatedAt success : now for noIatJWTToken', () => {
      // we consider dates are the same if differing from minus than 10 ms
      expect(noIatJWTToken.getCreatedAt().getTime() - now.getTime() < 10);
    });

    it('getTokenExpDate success', () => {
      const date = new Date(0);
      date.setTime(2532350800000);
      expect(validJWTToken.getTokenExpDate()).toEqual(date);
    });

    it('getTokenExpDate is empty', () => {
      expect(noExpJWTToken.getTokenExpDate()).toBeNull();
    });

    it('no exp date token is valid', () => {
      expect(noExpJWTToken.isValid()).toEqual(true);
    });

    it('isValid success', () => {
      expect(validJWTToken.isValid()).toEqual(true);
    });

    it('isValid fail', () => {
      // without token
      expect(new FlexAuthJWTToken('', 'strategy', new Date()).isValid()).toBeFalsy();


      // expired date
      expect(expiredJWTToken.isValid()).toBeFalsy();
    });

    it('AuthJWTToken name', () => {
      // without token
      expect(FlexAuthJWTToken.NAME).toEqual(validJWTToken.getName());
    });

    it('AuthSimpleToken name', () => {
      // without token
      expect(FlexAuthSimpleToken.NAME).toEqual(simpleToken.getName());
    });

    it('NbAuthSimpleToken has payload', () => {
      // without token
      expect(simpleToken.getPayload()).toEqual(null);
    });

    it('getPayload success', () => {
      expect(validJWTToken.getPayload())
      // tslint:disable-next-line
        .toEqual(JSON.parse('{"iss":"cerema.fr","iat":1532350800,"exp":2532350800,"sub":"Alain CHARLES","admin":true}'));
    });

    it('AuthJWTToken name', () => {
      // without token
      expect(FlexAuthJWTToken.NAME).toEqual(validJWTToken.getName());
    });

    it('AuthSimpleToken name', () => {
      // without token
      expect(FlexAuthSimpleToken.NAME).toEqual(simpleToken.getName());
    });

    it('AuthSimpleToken has payload', () => {
      // without token
      expect(simpleToken.getPayload()).toEqual(null);
    });
  });
});
