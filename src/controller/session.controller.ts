import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession } from "../service/session.service";

export async function createUserSessionHandler(req: Request, res: Response) {

  // 1. Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // 2. Create a session
  const session = createSession(user._id, req.get("user-agent") || "")

  // 3. Create an access token
  // 4. Create a refresh token
  // 5. Return access & refresh tokens
}