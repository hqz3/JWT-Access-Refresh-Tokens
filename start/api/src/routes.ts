import { Express } from "express";
import { createSessionHandler } from "../controllers/controller";

function routes(app: Express) {
  // login
  app.post("/api/session", createSessionHandler);

  // get the current session
  // logout
}

export default routes;
