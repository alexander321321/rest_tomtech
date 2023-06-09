import { Request, Response } from "express";
import config from "config";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {

  // 1. Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // 2. Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // 3. Create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } //15 minutes
  );

  // 4. Create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") }
  );

  // 5. Return access & refresh tokens
  return res.send({ accessToken, refreshToken })
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  console.log(userId);

  const sessions = await findSessions({ user: userId, valid: true });
  console.log({ sessions });
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}