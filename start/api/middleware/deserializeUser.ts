import { Request, Response, NextFunction } from "express";
import { signJWT, verifyJWT } from "../utils/jwt";
import { getSession } from "../src/db";

export default function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken) return next();
  const { payload, expired } = verifyJWT(accessToken);

  // Valid access token
  if (payload) {
    // @ts-ignore
    req.user = payload;
    return next();
  }

  // Expired access token but valid refresh token
  const { payload: refreshPayload } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  // If refreshToken is incorrect or expired
  if (!refreshPayload) return next();

  // Use the refreshToken's sessionId to find user session
  // getSession returns user session object ({sessionId, email, name, valid}) from db
  // @ts-ignore
  const session = getSession(refreshPayload.sessionId);
  if (!session) return next();

  // Create a new accessToken using the user session
  const newAccessToken = signJWT(session, "5s");

  res.cookie("accessToken", newAccessToken, { maxAge: 300000, httpOnly: true });

  // @ts-ignore
  req.user = verifyJWT(newAccessToken).payload;

  return next();
}
