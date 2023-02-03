import { Request, Response } from "express";
import { createSession, getUser, invalidateSession } from "../src/db";
import { signJWT } from "../utils/jwt";

export function createSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = getUser(email);

  if (!user || user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  const session = createSession(user.email, user.name);

  // create access token
  const accessToken = signJWT(
    { sessionId: session.sessionId, email: user.email, name: user.name },
    "5s"
  );

  // create refresh token
  const refreshToken = signJWT({ sessionId: session.sessionId }, "1h");

  // set access and refresh token in cookie
  res.cookie("accessToken", accessToken, { maxAge: 300000, httpOnly: true });
  res.cookie("refreshToken", refreshToken, { maxAge: 3.6e6, httpOnly: true }); // 1 hour

  // send back user session
  // res.send(verifyJWT(accessToken).payload);
  res.send(session);
}

export function getSessionHandler(req: Request, res: Response) {
  // @ts-ignore
  res.send(req.user);
}

export function deleteSessionHandler(req: Request, res: Response) {
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
  });

  res.cookie("refreshToken", "", {
    maxAge: 0,
    httpOnly: true,
  });

  // @ts-ignore
  invalidateSession(req.user.sessionId);

  res.send({ success: true });
}
