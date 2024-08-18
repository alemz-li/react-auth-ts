import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "config";

export const signJwt = (
  payload: JwtPayload,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions = {},
) => {
  const privateKey = config.get<string>(keyName);

  return jwt.sign(payload, privateKey, {
    ...(options && options),
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
): T | null => {
  try {
    const privateKey = config.get<string>(keyName);

    return jwt.verify(token, privateKey) as T;
  } catch (error) {
    return null;
  }
};
