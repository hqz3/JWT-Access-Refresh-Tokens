import { Request, Response } from "express";
import { getUser } from "../src/db";
import { signJWT, verifyJWT } from "../utils/jwt";

export function createSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = getUser(email);

  if (!user || user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  // // create access token
  const accessToken = signJWT({ email: user.email, name: user.name }, "1h");

  // set access token in cookie
  res.cookie("accessToken", accessToken, { maxAge: 300000, httpOnly: true });

  // send user back
  res.send(verifyJWT(accessToken).payload);
}

export function getSessionHandler(req: Request, res: Response) {
  // @ts-ignore
  res.send(req.user);
}
