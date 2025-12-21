export type AuthJwtPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};
