declare module 'custom-types' {
  export interface GoogleUser {
    googleId: string;
    email: string;
    displayName: string;
    avatar: string;
    accessToken: string;
  }

  export interface User {
    id: string;
    email: string;
    avatar: string;
    name: string;
  }

  export interface JwtPayLoad {
    sub: number;
    email: string;
    roles: string;
  }

  export interface Jwt {
    user: {
      id: number;
      email: string;
      roles: string;
    };
  }
}
