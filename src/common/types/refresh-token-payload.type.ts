export type RefreshTokenPayload = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
};
