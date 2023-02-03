import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

export default function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken } = req.cookies;

  if (!accessToken) return next();

  const { payload, expired } = verifyJWT(accessToken);
  console.log("expired:", expired);

  if (payload) {
    // @ts-ignore
    req.user = payload;
  }
  return next();
}
