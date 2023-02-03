import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";

export default function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken } = req.cookies;

  if (!accessToken) return next();

  const { payload } = verifyJWT(accessToken);

  if (payload) {
    // @ts-ignore
    req.user = payload;
  }
  return next();
}
